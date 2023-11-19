import json
from util import DecimalEncoder
from models import BetaSignup
from db_base import db_base
from constants import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION
from util import time_log
import boto3

class db_beta(db_base):
    """Class for beta signup entities."""
    @classmethod
    def init(cls):
        cls.db = boto3.resource('dynamodb',
                                aws_access_key_id=AWS_ACCESS_KEY,
                                aws_secret_access_key=AWS_SECRET_KEY,
                                region_name=AWS_REGION)
        cls.table = cls.db.Table('mono-beta')
        return cls.table.creation_date_time

    @classmethod
    def create(cls, email, content):
        validate = BetaSignup(**content)
        cls.table.put_item(
            Item={'email': email, 
                  'pst': time_log.get_pst(), 'kst': time_log.get_kst(), 
                  **content},
            ConditionExpression='attribute_not_exists(email)'
        )
        
    @classmethod
    def update(cls, email, update_dict):
        # TODO : validate update_dict
        update_dict = json.loads(json.dumps(update_dict, cls=DecimalEncoder))
        from decimal import Decimal
        exprs = [(k, v) for k, v in update_dict.items()]
        return cls.table.update_item(
            Key={'email': email},
            UpdateExpression='SET ' + ', '.join([f'{k} = :{k}' for k, v in exprs]),
            ExpressionAttributeValues={f':{k}': json.loads(json.dumps(v), parse_float=Decimal) for k, v in exprs},
            ReturnValues="UPDATED_NEW"
        )

    @classmethod
    def get(cls, email):
        response = cls.table.get_item(
            Key={'email': email}
        )
        try:
            return response['Item']
        except KeyError:
            return None
