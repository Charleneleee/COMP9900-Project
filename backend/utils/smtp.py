import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class SMTPManager:
    def __init__(self, smtp_config):
        self.host = smtp_config["host"]
        self.user = smtp_config["user"]
        self.password = smtp_config["password"]
        self.port = smtp_config["port"]

    def send_email(self, recipient, subject, message):
        msg = MIMEText(message)
        msg["From"] = self.user
        msg["To"] = recipient
        msg["Subject"] = subject

        try:
            self.server = smtplib.SMTP(self.host, self.port)
            self.server.starttls()
            self.server.login(self.user, self.password)

            self.server.send_message(msg)
        except smtplib.SMTPResponseException as e:
            error_code = e.smtp_code
            error_message = e.smtp_error
            print(f"SMTP Error: {error_code} - {error_message}")
        else:
            print(f"Email sent to {recipient} successfully!")
