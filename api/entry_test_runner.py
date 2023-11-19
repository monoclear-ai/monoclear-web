#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
TestRunner server for evaluating models.

This script is a daemon that listens to the SQS queue for tasks.
When a task is received, it will evaluate the model and send the results to the result queue.

The task queue is populated by the API server.
The result queue is populated by this daemon.

Currently for use with the leaderboard.
"""

from huggingface_hub.hf_api import HfFolder; HfFolder.save_token('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')

import json
import boto3
from util import DateTimeEncoder
from constants import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, TASK_QUEUE_URL, RESULT_QUEUE_URL

from sqs_listener import SqsListener

from test_base import GEN_TASKS
from lm_eval import tasks, evaluator, utils

from models import *
from db_users import db_users
from db_evals import db_evals
from db_models import db_models

from datetime import datetime
from util import DateTimeEncoder

# DB initialization
db_users.init()
db_evals.init()
db_models.init()

TEST_MODE = False
HAERAE_TASKS = ["haerae_hi","haerae_kgk","haerae_lw","haerae_rc","haerae_rw","haerae_sn"]
KOBEST_TASKS = ["kobest_boolq", "kobest_copa", "kobest_hellaswag", "kobest_sentineg", "kobest_wic"]
KLUE_TASKS = ["klue_nli", "klue_sts", "klue_ynat"]

QUICK_TASK_STR = ','.join(HAERAE_TASKS)
FULL_TASK_STR = ','.join(KOBEST_TASKS + KLUE_TASKS + HAERAE_TASKS)

# SQS initialization
sqs = boto3.resource('sqs')
res_queue = sqs.Queue(RESULT_QUEUE_URL)

class Evaluator():
    """Evaluator class competible with LM Evaluation Harness."""
    def __init__(self, payload: AsyncTaskPayload, truncate: bool) -> None:
        self.model_args = ""
        self.provide_description = False
        self.num_fewshot = 3
        self.batch_size = None
        self.max_batch_size=None
        self.device=None
        self.output_path=None
        self.limit=None if not truncate else 200
        self.data_sampling=None
        self.no_cache=True
        self.decontamination_ngrams_path=None
        self.description_dict_path=None
        self.check_integrity=False
        self.write_out=False
        self.output_base_path=None

        self.model = "custom"
        self.params = ["endpoint", "head", "body"]
        self._load_model(payload)
        self._load_task(payload)

    def _load_model(self, payload: AsyncTaskPayload):
        tag = payload.model_tag
        model = db_models.get(tag)
        self.model_kwargs = {
            key: model[key] for key in self.params
        }

    def _load_task(self, payload: AsyncTaskPayload):
        task = payload.task_type
        if task == GEN_TASKS.TRUTHFULQA:
            self.tasks = "truthfulqa_gen"
        elif task == GEN_TASKS.LAMBADA:
            self.tasks = "lambada_openai"
        elif task == KOR_TASKS.QUICK_KOR:
            self.tasks = QUICK_TASK_STR
        elif task == KOR_TASKS.FULL_KOR:
            # Reverse order for quick debuggs
            self.tasks = FULL_TASK_STR
        else:
            raise NotImplementedError(f"Unknown task type : {task}")
        
    def _parse_truthfulqa(self, results):
        results = results['results']['truthfulqa_gen']
        outputs = {
            'bleurt': results['bleurt_acc'],
            'bleu': results['bleu_acc'],
            'rouge1': results['rouge1_acc'],
        }
        outputs['truthfulqa_overall'] = sum(outputs.values()) / len(outputs)
        validate = GenTruthfulQAResult(**outputs)
        return outputs
    
    def _parse_lambada(self, results):
        # TODO : Confirm & validate
        results = results['results']['lambada_openai']
        outputs = {
            'Perplexity': results['perplexity'],
            'Accuracy': results['accuracy'],
        }
        outputs['lambada_overall'] = sum(outputs.values()) / len(outputs)
        return outputs
    
    def _parse_haerae(self, results):
        results = results['results']
        outputs = {
            f'{key}': results[key]['accuracy'] if key in results else -1.0 for key in HAERAE_TASKS
        }
        outputs['haerae_overall'] = sum(outputs.values()) / len(outputs)
        return outputs
    
    def _parse_kobest(self, results):
        results = results['results']
        outputs = {
            f'{key}': results[key]['accuracy'] if key in results else -1.0 for key in KOBEST_TASKS
        }
        outputs['kobest_overall'] = sum(outputs.values()) / len(outputs)
        return outputs
    
    def _parse_klue(self, results):
        results = results['results']
        outputs = {
            f'{key}': results[key]['accuracy'] if key in results else -1.0 for key in KLUE_TASKS
        }
        outputs['klue_overall'] = sum(outputs.values()) / len(outputs)
        return outputs

    def _parse_results(self, results):
        """Parse results from LM Evaluation Harness corresponding to the tasks specified."""
        print(results)
        if self.tasks == "truthfulqa_gen":
            return self._parse_truthfulqa(results)
        elif self.tasks == "lambada_openai":
            return self._parse_lambada(results)
        elif self.tasks == QUICK_TASK_STR:
            return self._parse_haerae(results)
        elif self.tasks == FULL_TASK_STR:
            part = {
                **self._parse_kobest(results),
                **self._parse_klue(results),
                **self._parse_haerae(results)
            }
            overalls = [v for k, v in part.items() if "overall" in k]
            part['alltasks_overall'] = sum(overalls) / len(overalls)
            return part
        else:
            raise NotImplementedError(f"Unknown task type : {self.tasks}")

    def evaluate(self):
        """Performs evaluations based on LM Evaluation Harness."""
        if self.limit:
            print(
                "WARNING: --limit SHOULD ONLY BE USED FOR TESTING. REAL METRICS SHOULD NOT BE COMPUTED USING LIMIT."
            )

        if self.tasks is None:
            task_names = tasks.ALL_TASKS
        else:
            task_names = utils.pattern_match(self.tasks.split(","), tasks.ALL_TASKS)

        print(f"Selected Tasks: {task_names}")

        description_dict = {}
        if self.description_dict_path:
            with open(self.description_dict_path, "r") as f:
                description_dict = json.load(f)

        results = evaluator.simple_evaluate(
            model=self.model,
            model_args=self.model_args,
            model_kwargs=self.model_kwargs,
            tasks=task_names,
            num_fewshot=self.num_fewshot,
            batch_size=self.batch_size,
            max_batch_size=self.max_batch_size,
            device=self.device,
            no_cache=self.no_cache,
            limit=self.limit,
            description_dict=description_dict,
            decontamination_ngrams_path=self.decontamination_ngrams_path,
            check_integrity=self.check_integrity,
            write_out=self.write_out,
            output_base_path=self.output_base_path,
        )

        return self._parse_results(results)

class TestRunListener(SqsListener):
    """Listener for the task queue.
    When a task is received, it will evaluate the model and send the results to the result queue.
    """
    def handle_message(self, body, attributes, messages_attributes):
        print(datetime.now())
        print(body)
        # BLOCKING RUN
        overall_type = body[0]
        if overall_type == QueueType.ASYNC_TASK:
            task_payload = AsyncTaskPayload(**body[1])

            truncate = task_payload.task_type == KOR_TASKS.FULL_KOR
            # Blocking, will take minutes.
            eval = Evaluator(task_payload, truncate=truncate)
            result = eval.evaluate()
            print(result)
            # TODO : Send results to the result queue

            result_payload = TaskResultPayload(
                            id=str(uuid.uuid4()),
                            email=task_payload.email,
                            model_tag=task_payload.model_tag, 
                            submit_at=task_payload.created_at,
                            created_at=datetime.now(), 
                            task_type=task_payload.task_type,
                            result=result)
            result_payload = [QueueType.TASK_RESULT, dict(result_payload)]
            print(result_payload)

            response = res_queue.send_message(MessageBody=json.dumps(result_payload, cls=DateTimeEncoder))
            print(response.get('MessageId'))
            print(response.get('MD5OfMessageBody'))
        else:
            raise NotImplementedError(f"Unknown task type : {overall_type}")

        return True

# TODO: Maybe implement a task pool or asynchronous executions?
# TODO: Another option is running multiple blocking daemons
# TODO: Check host utility 
if __name__ == "__main__":
    """AWS SQS Listener for the task queue."""
    test_run_listener = TestRunListener(
            queue="TaskQueue",
            queue_url=TASK_QUEUE_URL,
            region_name=AWS_REGION,
            aws_access_key=AWS_ACCESS_KEY,
            aws_secret_key=AWS_SECRET_KEY,
            # 1 minute delay between polling
            interval=60,
            wait_time=20
        )
    test_run_listener.listen()