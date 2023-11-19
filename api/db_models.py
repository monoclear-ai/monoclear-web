from models import HFModel
from models import MLModelFull
from db_base import db_base
from constants import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION
from util import time_log
import boto3

class db_models(db_base):
    """Class for ML models."""
    @classmethod
    def init(cls):
        cls.db = boto3.resource('dynamodb',
                                aws_access_key_id=AWS_ACCESS_KEY,
                                aws_secret_access_key=AWS_SECRET_KEY,
                                region_name=AWS_REGION)
        cls.table = cls.db.Table('mono-models')
        return cls.table.creation_date_time

    @classmethod
    def create(cls, content):
        validate = MLModelFull(**content)
        cls.table.put_item(
            Item={'pst': time_log.get_pst(), 'kst': time_log.get_kst(), 
                  **content},
            ConditionExpression='attribute_not_exists(tag)'
        )

    @classmethod
    def create_hf(cls, content):
        validate = HFModel(**content)
        cls.table.put_item(
            Item={'pst': time_log.get_pst(), 'kst': time_log.get_kst(), 
                  **content},
            ConditionExpression='attribute_not_exists(tag)'
        )
        
    @classmethod
    def update(cls, tag, update_dict):
        cls.table.update_item(
            Item={'tag': tag, 
                  **update_dict}
        )

    @classmethod
    def get(cls, tag):
        response = cls.table.get_item(
            Key={'tag': tag}
        )
        try:
            return response['Item']
        except KeyError:
            return None
