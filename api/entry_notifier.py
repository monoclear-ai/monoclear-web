#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
from constants import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, RESULT_QUEUE_URL, WEBSITE_URL

from sqs_listener import SqsListener

from test_base import GEN_TASKS

from models import *
from db_users import db_users
from db_evals import db_evals
from db_models import db_models
from db_ranking import db_ranking

from datetime import datetime
from util_email import EmailSender

db_users.init()
db_evals.init()
db_models.init()
db_ranking.init()

TEST_MODE = True

# The subject line for the email.
SUBJECT = "Korean Leaderboard Eval Success"

# TODO : Prettier email
# The email body for recipients with non-HTML email clients.
BODY_TEXT = ("{}\r\n"
             "Model '{}' has been evaluated on '{}'.\r\n"
             "Please check on {}.\r\n"
            )

# TODO : Prettier email
# The HTML body of the email.
BODY_HTML = """<html>
<head></head>
<body>
  <h1>{}</h1>
  <p>Model '{}' has been evaluated on '{}'.</p>
  <p>Please check on <a href="{}">https://website.com</a>.</p>
  <p>You can confirm and manage detailed results when you sign up for our beta service.</p>
</body>
</html>"""

class Notifier():

    def __init__(self, payload: TaskResultPayload) -> None:
        self.payload = payload
        self.email = EmailSender(recipient=payload.email)

    def notify(self):
        email = self.payload.email
        user = db_users.get(email)
        eval_key = user['eval_key']
        eval = db_evals.get(eval_key=eval_key)

        # TODO : Store result to evals DB
        task_type = self.payload.task_type
        model_tag = self.payload.model_tag
        result = self.payload.result
        submit_at = self.payload.submit_at

        # TODO : Unify with MonoServer
        update_eval = {
            'model_tags': eval['model_tags'],
            'perf_score': eval['perf_score'],
            # 'perf_mistakes': eval['perf_mistakes'],
            'submit_dates': eval['submit_dates'],
            'sample_links': eval['sample_links']
        }
        if model_tag not in update_eval['model_tags']:
            nxt_idx = len(update_eval['model_tags'])
            update_eval['model_tags'].append(model_tag)
            update_eval['submit_dates'].append(submit_at.isoformat())
            sample_key = f"{eval_key}__{model_tag}__{nxt_idx}"
            # FIXME : Proper sample handling
            db_samples.create(sample_key, {
                'sample_key': sample_key,
                'sample_type': "wrong_only",
                'samples': []
            })
            update_eval['sample_links'].append("/backend/user/{email}/samples/{model_tag}/{nxt_idx}")
        else:
            # FIXME : Modify so that multiple submissions are allowed i.e. with different tests.
            print(f"Model tag exists {model_tag} in eval {eval_key}, we will assume additional eval for {task_type}.")

        if task_type in [GEN_TASKS.TRUTHFULQA, KOR_TASKS.QUICK_KOR, KOR_TASKS.FULL_KOR]:
            if model_tag not in update_eval['perf_score']:
                update_eval['perf_score'][model_tag] = {}
            update_eval['perf_score'][model_tag][task_type] = result
            # TODO : Mistake listing
            # update_eval['perf_mistakes'][model_tag] = {task_type: []}
        else:
            raise NotImplementedError(f"Unknown task type : {task_type}")

        eval_res = db_evals.update(eval_key, update_eval)
        print(eval_res)

        # TODO : Confirm completed tasks from DB
        # For now, assume that all tasks are completed.
        send = True
        
        # TODO : Send email
        # TODO : Notify client
        if send:
            # Only add to private ranking on the same condition as email - when a set of tasks are completed.
            # For now, everytime.
            updated_scores = update_eval['perf_score'][model_tag]
            
            rank_private_key = f"{task_type}__{self.payload.email}"
            private_rank = db_ranking.get(rank_private_key)
            
            new_ranks = []
            # TODO : Sorting on the submit dates in case of problems.
            # Remove if same tag item exists.
            for tag, cur_date, score in private_rank['ranks']:
                if tag != model_tag:
                    new_ranks.append((tag, cur_date, score))
            # Add the latest item.
            from collections import deque
            new_ranks = deque(new_ranks)
            new_ranks.appendleft((model_tag, submit_at.isoformat(), updated_scores))
            new_ranks = list(new_ranks)

            # if len(new_ranks) > 10:
            #     new_ranks = new_ranks[-10:]
            private_rank_update = {
                'ranks': new_ranks
            }
            rank_res = db_ranking.update(rank_private_key, private_rank_update)
            print(rank_res)

            # Email
            display_tag = model_tag.split("__", 1)[1]
            self.email.send_admin_email(subject=SUBJECT, 
                                        body_txt=BODY_TEXT.format(SUBJECT, display_tag, task_type, WEBSITE_URL),
                                        body_html=BODY_HTML.format(SUBJECT, display_tag, task_type, WEBSITE_URL))

# Consider task pooling
class TestResultListener(SqsListener):
    def handle_message(self, body, attributes, messages_attributes):
        print(datetime.now())
        print(body)
        # BLOCKING RUN
        overall_type = body[0]
        if overall_type == QueueType.TASK_RESULT:
            result_payload = TaskResultPayload(**body[1])

            # Blocking.
            notify = Notifier(result_payload)
            result = notify.notify()
            print(result)
        else:
            raise NotImplementedError(f"Unknown task type : {overall_type}")

        return True


# TODO: Maybe implement a task pool or asynchronous executions?
# TODO: Another option is running multiple blocking daemons
# TODO: Check host utility 
if __name__ == "__main__":
    test_run_listener = TestResultListener(
            queue="TaskQueue",
            queue_url=RESULT_QUEUE_URL,
            region_name=AWS_REGION,
            aws_access_key=AWS_ACCESS_KEY,
            aws_secret_key=AWS_SECRET_KEY,
            # 1 minute delay between polling
            interval=60,
            wait_time=20
        )
    test_run_listener.listen()