import uuid
from typing import Any, Dict, List, Tuple, Optional, Union
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Json
from fastapi_events.registry.payload_schema import registry as payload_schema
from test_base import KOR_TASKS

from test_base import GEN_TASKS, MC_TASKS

# class MLModel(BaseModel):
#     tag: str
#     save_date: datetime
#     eval_key: uuid.UUID
#     engine: str
#     endpoint: str
#     private_token: str = ""

# First parameter is the unique key in most models.

class BetaSignup(BaseModel):
    """Beta signup information."""
    email: str
    save_date: Optional[datetime] = None
    name: str = ""
    org: str = ""
    upload: str = ""
    feature: str = ""


class MLModelFull(BaseModel):
    """ML Model (custom API) information. Used with the leaderboard."""
    tag: str
    save_date: Optional[datetime] = None
    eval_key: Optional[str] = None
    endpoint: str
    head: str
    body: str


class HFModel(BaseModel):
    """Huggingface Model information. Used with the leaderboard."""
    tag: str
    eval_key: Optional[str] = None
    save_date: Optional[datetime] = None
    hf_path: str


class User(BaseModel):
    """User information. Email is unique key."""
    email: str
    name: str
    eval_key: str = ""


class Samples(BaseModel):
    """Sample information. Used with the Python SDK."""
    sample_key: str

    # wrong_only is default.
    sample_type: str = "wrong_only"

    # Each item should be keyed by
    # Category, No, Prompt, Response, Truth, Correct
    samples: List[Dict[str, Any]] = []


class Eval(BaseModel):
    """Evaluation information. Used with the Python SDK & leaderboard."""
    eval_key: str

    # Added at the time of notification.
    model_tags: List[str] = []
    submit_dates: List[datetime] = []

    # All keyed by ModelTag and then by Task.
    perf_score: Dict[str, Dict[str, Any]] = {}

    # Paginated sample links. First page.
    sample_links: List[str] = []

    # perf_mistakes: Dict[str, Dict[str, Any]] = {}
    # safe_score: Dict[str, Dict[str, Any]] = {}
    # safe_mistakes: Dict[str, Dict[str, Any]] = {}
    # custom_score: Dict[str, Dict[str, Any]] = {}
    # custom_mistakes: Dict[str, Dict[str, Any]] = {}


class Ranking(BaseModel):
    """Ranking information. Used with the leaderboard."""
    # key
    task_privacy: str
    # Not sorted.
    # List of (model_tag, submit date, score_dict)
    # Only latest 3 models remain for private models.
    ranks: List[Tuple[str, datetime, Dict[str, Any]]] = []


class BaseResult(BaseModel):
    """Default result schema used with the leaderboard & testrunner."""
    overall: float

class GenTruthfulQAResult(BaseResult):
    """Truthful QA result schema used with the leaderboard & testrunner."""
    bleurt: float
    bleu: float
    rouge1: float


class QueueType(str, Enum):
    ASYNC_TASK = "async_task"
    TASK_RESULT = "task_result"


@payload_schema.register(event_name=QueueType.ASYNC_TASK)
class AsyncTaskPayload(BaseModel):
    """Async Task Payload used with the leaderboard & testrunner."""
    id: str
    email: str
    model_tag: str
    created_at: datetime
    task_type: Union[MC_TASKS, GEN_TASKS, KOR_TASKS]


@payload_schema.register(event_name=QueueType.TASK_RESULT)
class TaskResultPayload(BaseModel):
    """Task Result Payload used with the leaderboard & testrunner."""
    id: str
    email: str
    model_tag: str
    submit_at: datetime
    created_at: datetime
    task_type: Union[MC_TASKS, GEN_TASKS, KOR_TASKS]
    result: Dict[str, float]
