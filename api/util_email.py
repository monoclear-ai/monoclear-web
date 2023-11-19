import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('../.env')
load_dotenv(dotenv_path=dotenv_path)


SENDER = f"Monoclear <{os.getenv('EMAIL_FROM')}>"

# If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
AWS_REGION = os.getenv('SERVER_AWS_REGION') 

# The character encoding for the email.
CHARSET = "UTF-8"

class EmailSender:
    """
    A class to send emails using AWS SES.
    """

    def __init__(self, recipient) -> None:
        self.recipient = recipient
        self.client = boto3.client('ses',region_name=AWS_REGION)

    def send_admin_email(self, subject, body_txt, body_html):
        # Try to send the email.
        try:
            #Provide the contents of the email.
            response = self.client.send_email(
                Destination={
                    'ToAddresses': [
                        self.recipient,
                    ],
                },
                Message={
                    'Subject': {
                        'Charset': CHARSET,
                        'Data': subject,
                    },
                    'Body': {
                        'Html': {
                            'Charset': CHARSET,
                            'Data': body_html,
                        },
                        'Text': {
                            'Charset': CHARSET,
                            'Data': body_txt,
                        },
                    },
                },
                Source=SENDER,
                # If you are not using a configuration set, comment or delete the
                # following line
                # ConfigurationSetName=CONFIGURATION_SET,
            )
        # Display an error if something goes wrong.	
        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            print(f"Email sent! Message ID: {response['MessageId']}")

