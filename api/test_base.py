from dataclasses import dataclass
from abc import ABC
from datetime import datetime
from enum import Enum
import json
import uuid
from constants import SEND_QUEUE_URL

from util import DateTimeEncoder

# Task Types for multi-class evaluation.
class MC_TASKS(str, Enum):
    MMLU = "mc_mmlu"
    HELLA_SWAG = "mc_hellaswag"
    ARC = "mc_arc"
    TRUTHFULQA = "mc_truthfulqa"

# Task Types for generative evaluatoin.
class GEN_TASKS(str, Enum):
    LAMBADA = "gen_lambada"
    TRUTHFULQA = "gen_truthfulqa"

# Task Types for Korean evaluation.
class KOR_TASKS(str, Enum):
    QUICK_KOR = "quick_kor"
    FULL_KOR = "full_kor"

@dataclass
class EVAL_STORED:
    task: str
    started: str = ""
    ended: str = ""
    eval: dict = None

# Base class for evaluation results.
class EVAL_BASE(ABC):
    pass

@dataclass
class EVAL_IN_PROGRESS(EVAL_BASE):
    task: str = ""
    message: str = ""
    # Timestamp
    started: str = ""

@dataclass
class EVAL_SUCCESS(EVAL_BASE):
    task: str
    message: str = ""
    # Timestamp
    started: str = ""
    ended: str = ""
    eval: dict = None

@dataclass
class EVAL_FAILURE(EVAL_BASE):
    task: str
    message: str = ""
    # Timestamp
    started: str = ""
    ended: str = ""

import boto3
sqs = boto3.resource('sqs')
res_queue = sqs.Queue(SEND_QUEUE_URL)

# Base class for implementing tests.
class test_base(ABC):
    @classmethod
    def init(cls):
        pass

    @classmethod
    def run(cls, email, model_tag) -> EVAL_BASE:
        from models import AsyncTaskPayload, QueueType
        payload = AsyncTaskPayload(id=str(uuid.uuid4()),
                        email=email,
                        model_tag=model_tag, 
                        created_at=datetime.now(), 
                        task_type=cls.task_type)

        send_payload = [QueueType.ASYNC_TASK, dict(payload)]
        print(send_payload)

        response = res_queue.send_message(MessageBody=json.dumps(send_payload, cls=DateTimeEncoder))
        print(response.get('MessageId'))
        print(response.get('MD5OfMessageBody'))

    @classmethod
    def get_eval(cls, model_tag) -> EVAL_STORED:
        raise NotImplementedError("get_eval not implemented")