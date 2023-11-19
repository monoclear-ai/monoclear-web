#!/usr/bin/python
# -*- coding: utf-8 -*-

from mailchimp_marketing.api_client import ApiClientError
import mailchimp_marketing as MailchimpMarketing
import json
from typing import Annotated
import uuid
import requests
import logging
from botocore.exceptions import ClientError
from db_beta import db_beta
from tests_async import test_quick_kor
from tests_async import get_quick_kor_tests, get_full_kor_tests
from test_base import KOR_TASKS

from fastapi import FastAPI, Request

from fastapi.middleware.cors import CORSMiddleware
from util import tagger

from models import *

from constants import MAILCHIMP_API, MAILCHIMP_SERVER, MAILCHIMP_LIST_ID

from db_users import db_users
from db_evals import db_evals
from db_models import db_models
from db_ranking import db_ranking
from db_auth import db_auth
from db_samples import db_samples
from tests_async import get_mc_tests, get_gen_tests

from util import time_log

origins = [
    "http://website.com",
    "http://www.website.com",
    "https://website.com",
    "https://www.website.com",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://ec2-****.compute-1.amazonaws.com"
]

# FAST API initialization
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mailchimp Initialization
try:
    client = MailchimpMarketing.Client()
    client.set_config({
        "api_key": MAILCHIMP_API,
        "server": MAILCHIMP_SERVER
    })
    response = client.ping.get()
    print(response)
except ApiClientError as error:
    print(error)
    client = None

# Request Logging
async def set_body(request: Request, body: bytes):
    async def receive():
        return {"type": "http.request", "body": body}
    request._receive = receive


async def get_body(request: Request) -> bytes:
    body = await request.body()
    await set_body(request, body)
    return body

@app.middleware("http")
async def app_entry(request: Request, call_next):

    await set_body(request, await request.body())

    print(await get_body(request))

    response = await call_next(request)
    return response


# DB initialization
db_users.init()
db_evals.init()
db_models.init()
db_ranking.init()
db_beta.init()
db_auth.init()
db_samples.init()

# Test initializations
test_quick_kor.init()

for test in get_gen_tests():
    test.init()

for test in get_mc_tests():
    test.init()

for test in get_quick_kor_tests():
    test.init()

for test in get_full_kor_tests():
    test.init()


@app.get("/backend")
async def root():
    """
    Health check.
    """
    return {"message": "Hello World"}


@app.post("/backend/beta/signup")
async def beta_signup(betaInfo: BetaSignup):
    """
    Signup for Beta program.
    """
    betaInfo.save_date = time_log.get_pst()
    try:
        db_beta.create(betaInfo.email, dict(betaInfo))
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {"message": "It's a duplicate email.", "status": "failed", "model": betaInfo}
        else:
            return {"message": e.response['Error']['Code'], "status": "failed", "model": betaInfo}
    return {"message": "Beta registration success.", "status": "success", "model": betaInfo}


@app.post("/backend/email/{email}/signup")
async def email_signup(email: str):
    """
    Subscribe to email list.
    """
    try:
        response = client.lists.add_list_member(MAILCHIMP_LIST_ID, {
            "email_address": email,
            "status": "subscribed",
            "merge_fields": {
                "FNAME": "YOUR_FIRST_NAME",
                "LNAME": "YOUR_LAST_NAME"
            }
        })
        print(response)
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {"message": "It's a duplicate email.", "status": "failed", "email": email}
        else:
            return {"message": e.response['Error']['Code'], "status": "failed", "email": email}
    except ApiClientError as e:
        return {"message": e['title'], "status": "failed", "email": email}
    return {"message": "Beta registration success.", "status": "success", "email": email}


@app.post("/backend/create_user")
async def create_user(user: User):
    """
    Create User.

    Eval is created at the same time and tied to User via eval_key.
    """
    eval_key = str(uuid.uuid4())
    eval = Eval(eval_key=eval_key)
    user.eval_key = eval_key
    try:
        db_users.create(user.email, dict(user))
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {"message": "Already existing User.", "status": "failed", "user": user, "eval": eval}
        else:
            return {"message": e.response['Error']['Code'], "status": "failed", "user": user, "eval": eval}
    try:
        db_evals.create(eval_key, dict(eval))
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {"message": "Already existing Eval.", "status": "failed", "user": user, "eval": eval}
        else:
            return {"message": e.response['Error']['Code'], "status": "failed", "user": user, "eval": eval}
    msg = "User created"
    return {"message": msg, "user": user, "eval": eval}


@app.post("/backend/test_model_full")
async def test_model_full(model: MLModelFull):
    """
    Testing whether custom LLM API works or not.
    Leaderboard data loading.
    """
    # No saving
    head = json.loads(model.head)
    body = json.loads(model.body)
    r = requests.post(model.endpoint, json=body, headers=head)
    logging.warn("*************************************************")
    logging.warn(r)
    return {"message": "Model tested", "model": model, "response": json.loads(r.text)}


@app.post("/backend/user/{email}/save_model_full")
async def save_model_full(email: str, model: MLModelFull):
    """
    Saving LLM API information.
    Leaderboard data loading.

    Email is used to get User information.
    LLM API information is saved as a Model separately.
    """
    logging.warn("START*************************************************")
    logging.warn(model)

    user = db_users.get(email)

    logging.warn(user)

    eval_key = user["eval_key"]
    eval = db_evals.get(eval_key)   # Validation

    unique_tag = tagger.unique_tag(eval_key, model.tag)
    model.tag = unique_tag
    model.save_date = time_log.get_pst()
    model.eval_key = eval_key

    logging.warn("*************************************************")
    logging.warn(unique_tag)
    logging.warn(model)
    try:
        db_models.create(dict(model))
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {"message": "Already existing tag.", "status": "failed", "model": model}
        else:
            return {"message": e.response['Error']['Code'], "status": "failed", "model": model}
    return {"message": "Model saved", "status": "success", "model": model}


@app.post("/backend/user/{email}/save_hf")
async def save_hf(email: str, model: HFModel):
    """
    Saving HuggingFace model information.
    Leaderboard data loading.

    Email is used to get User information.
    HuggingFace model information is saved as a Model separately.
    """
    logging.warn("START*************************************************")
    logging.warn(model)

    user = db_users.get(email)

    logging.warn(user)

    eval_key = user["eval_key"]
    eval = db_evals.get(eval_key)   # Validation

    unique_tag = tagger.unique_tag(eval_key, model.tag)
    model.tag = unique_tag
    model.save_date = time_log.get_pst()
    model.eval_key = eval_key

    logging.warn("*************************************************")
    logging.warn(unique_tag)
    logging.warn(model)
    try:
        db_models.create_hf(dict(model))
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {"message": "Already existing tag.", "status": "failed", "model": model}
        else:
            return {"message": e.response['Error']['Code'], "status": "failed", "model": model}
    return {"message": "Model saved", "status": "success", "model": model}

# TODO : Adjust model info

# Gen EVALs only for now
# TODO : Add MC EVALs / new EVALs


@app.post("/backend/user/{email}/kor_quick_eval/{model_tag}")
async def kor_quick_eval(email: str, model_tag: str):
    """
    Queuing quick Korean evaluation (HAERAE only).
    Leaderboard data loading.

    TODO : In the future, maybe add a local evaluation.
    """

    # Email will be used to search for an user.
    # If the user doesn't exist, still provide return email info.
    user = db_users.get(email)
    user = User(**user)
    model_tag = tagger.unique_tag(user.eval_key, model_tag)

    tests = get_quick_kor_tests()

    for test in tests:
        test.run(email, model_tag)

    return {"message": "Quick Korean Eval queued.",
            "email": email,
            "model_tag": model_tag}
# TODO : Adjust model info


@app.post("/backend/user/{email}/kor_full_eval/{model_tag}")
async def kor_full_eval(email: str, model_tag: str):
    """
    Queuing full Korean evaluation (3 evaluations).
    Leaderboard data loading.
    """

    # Email will be used to search for an user.
    # If the user doesn't exist, still provide return email info.
    user = db_users.get(email)
    user = User(**user)
    model_tag = tagger.unique_tag(user.eval_key, model_tag)

    tests = get_full_kor_tests()

    for test in tests:
        test.run(email, model_tag)

    return {"message": "Full Korean Eval queued.",
            "email": email,
            "model_tag": model_tag}


@app.get("/backend/public_ranks")
async def public_ranks():
    """
    Obtain public ranks for the leaderboard.
    No authentication required.
    """
    # NO auth check for public API

    rank_payload = {}
    for task in KOR_TASKS:
        public_key = f"{task}__public"
        public_rank = db_ranking.get(public_key)
        if not public_rank:
            public_rank = Ranking(task_privacy=public_key)
            db_ranking.create(public_key, dict(public_rank))

        sota_key = f"{task}__sota"
        sota_rank = db_ranking.get(sota_key)
        if not sota_rank:
            sota_rank = Ranking(task_privacy=sota_key)
            db_ranking.create(sota_key, dict(sota_rank))

        rank_payload[task] = {
            "public": public_rank,
            "sota": sota_rank,
        }

    return {"message": "Public ranks loaded", "ranks": rank_payload}


@app.get("/backend/eval/{eval_key}/samples/{model_tag}/{page}")
async def get_samples(eval_key: str, model_tag: str, page: int):
    """
    Obtain samples for deep analysis of model mistakes.
    Use with Python SDK.

    TODO : Add pagination.
    """
    sample_key = f"{eval_key}__{model_tag}__{page}"
    samples = db_samples.get(sample_key)
    if not samples:
        logging.error("Samples not found")
        samples = Samples(sample_key=sample_key)
        db_samples.create(sample_key, dict(samples))

    if samples["sample_type"] != "wrong_only":
        logging.error("Wrong sample type : " + samples["sample_type"])

    return {"message": "Samples loaded", "samples": samples["samples"],
            "sample_key": sample_key}


@app.get("/backend/user/{email}")
async def user_api(email: str):
    """
    Get user information with the email.

    Return user information, eval information, and ranks.
    Called upon login initialization with next-auth.

    SDK Key is eval_key corresponding to the user, which is also for use with the Python SDK.
    """
    user = db_users.get(email)
    if user:
        eval_key = user["eval_key"]
        eval = db_evals.get(eval_key)
        msg = "User found"
        if not eval:
            logging.error("Eval not found")
            eval = Eval(eval_key=eval_key)
            db_evals.create(eval_key, dict(eval))
    else:
        logging.error("User not found for " + email)
        return {"message": "User not found", "email": email}

    # get private and public ranks. create if not existing.
    rank_payload = {}
    for task in KOR_TASKS:
        public_key = f"{task}__public"
        public_rank = db_ranking.get(public_key)
        if not public_rank:
            public_rank = dict(Ranking(task_privacy=public_key))
            db_ranking.create(public_key, public_rank)

        sota_key = f"{task}__sota"
        sota_rank = db_ranking.get(sota_key)
        if not sota_rank:
            sota_rank = dict(Ranking(task_privacy=sota_key))
            db_ranking.create(sota_key, sota_rank)

        private_key_email = f"{task}__{email}"
        private_rank_email = db_ranking.get(private_key_email)
        if not private_rank_email:
            private_rank_email = dict(Ranking(task_privacy=private_key_email))
            db_ranking.create(private_key_email, private_rank_email)

        private_key_sdk = f"{task}__SDK__{eval_key}"
        private_rank_sdk = db_ranking.get(private_key_sdk)
        if not private_rank_sdk:
            private_rank_sdk = dict(Ranking(task_privacy=private_key_sdk))
            db_ranking.create(private_key_sdk, private_rank_sdk)

        # logging.warn("******** DEBUG RANK ********")
        # logging.warn(private_rank_email)
        # logging.warn(private_rank_sdk)

        private_rank = []
        private_rank.extend(private_rank_email["ranks"])
        private_rank.extend(private_rank_sdk["ranks"])

        private_rank = {
            "task_privacy": f"{task}__private",
            "ranks": private_rank
        }

        rank_payload[task] = {
            "public": public_rank,
            "sota": sota_rank,
            "private": private_rank
        }

    return {"message": msg, "user": user,
            "eval": eval, "ranks": rank_payload,
            "sdkKey": eval_key}

# @app.get("/backend/ranking/{task}/user/{email}")
# async def get_ranks(task: str, email: str):
#     if email != "public":
#         # TODO : Auth check
#         pass

#     ranks = db_ranking.get(f"{task}__{email}")
#     return {"message": "Ranking loaded", "email": email, "ranks": ranks}
#     # TODO : Language specific leaderboard


class RankUpdate(BaseModel):
    new_model_tags: list[str] = []


@app.post("/backend/ranking/{task}/submit")
async def update_ranks(task: str, rankUpdate: RankUpdate):
    """
    Calculates public ranks and SOTA ranks seperately.

    Public ranks include all submissions, while SOTA ranks only include best submission at given time.
    Leaderboard data loading.
    """

    new_model_tags = rankUpdate.new_model_tags
    public_rank_key = f"{task}__public"
    public_rank = db_ranking.get(public_rank_key)
    if not public_rank:
        raise ValueError("Public ranking not found")
    
    # Update PUBLIC RANKING
    public_ranks = public_rank["ranks"]
    # Removing duplicate tags
    for tag, submit_date, score_dict in public_ranks:
        if tag in new_model_tags:
            print(f"Tag already exists in public : {tag}")
            new_model_tags.remove(tag)
            continue
    # Adding new tags
    for tag in new_model_tags:
        model = db_models.get(tag)
        eval = db_evals.get(model["eval_key"])
        score = eval["perf_score"][tag][task]
        date = model["save_date"]
        public_ranks.append((tag, date, score))

    if task == KOR_TASKS.QUICK_KOR:
        def score_calc(x): return x[2]['haerae_overall']
    elif task == KOR_TASKS.FULL_KOR:
        def score_calc(x): return x[2]['alltasks_overall']
    else:
        raise ValueError(f"Unknown task : {task}")

    public_ranks.sort(key=score_calc, reverse=True)

    if len(public_ranks) > 500:
        public_ranks = public_ranks[:500]
    public_rank_update = {
        "ranks": public_ranks
    }
    db_ranking.update(public_rank_key, public_rank_update)

    # Update SOTA RANKING
    sota_rank_key = f"{task}__sota"
    sota_rank = db_ranking.get(sota_rank_key)
    if not sota_rank:
        raise ValueError("SOTA ranking not found")
    sota_ranks = sota_rank["ranks"]
    public_rank = public_ranks[0]
    if len(sota_ranks) == 0:
        sota_ranks.append(public_rank)
    elif sota_ranks[-1][1] < public_rank[1] and \
            score_calc(sota_ranks[-1]) < score_calc(public_rank):
        # SOTA ranks is in reverse.
        sota_ranks.append(public_rank)
    sota_rank_update = {
        "ranks": sota_ranks
    }
    db_ranking.update(sota_rank_key, sota_rank_update)

    return {"message": "Ranking updated", "task": task,
            "public": public_ranks, "sota": sota_ranks}
    # TODO : Language specific leaderboard

# @app.post("/backend/user/change_name")
# async def change_name(authUser: Annotated[Optional[Dict], Depends(get_auth_user)],
#                       email: str = Body(...), new_name: str = Body(...)):
#     db_users.update(email, {"name": new_name})
#     return {"message": "Name Changed", "email": email, "new_name": new_name}
