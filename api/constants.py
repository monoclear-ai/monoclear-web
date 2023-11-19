import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('./.env')
load_dotenv(dotenv_path=dotenv_path)

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
AWS_REGION = os.getenv('AWS_REGION')

MAILCHIMP_API = os.getenv('MAILCHIMP_API')
MAILCHIMP_SERVER = os.getenv('MAILCHIMP_SERVER')
MAILCHIMP_LIST_ID = os.getenv('MAILCHIMP_LIST_ID')

TASK_QUEUE_URL = os.getenv('TASK_QUEUE_URL')
RESULT_QUEUE_URL = os.getenv('RESULT_QUEUE_URL')
WEBSITE_URL = os.getenv('WEBSITE_URL')