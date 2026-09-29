#!/usr/bin/env python3
"""Send wiki run report via Gmail SMTP.

Required environment variables:
  MAIL_HOST     - SMTP host (e.g., smtp.gmail.com)
  MAIL_PORT     - SMTP port (e.g., 587)
  MAIL_USERNAME - Gmail address
  MAIL_PASSWORD - Gmail app password
  MAIL_TO       - Recipient address
  MAIL_SUBJECT  - Email subject
  MAIL_BODY_FILE - Path to body text file (optional, else reads stdin or MAIL_BODY)
"""
import os
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

host = os.environ.get("MAIL_HOST", "smtp.gmail.com")
port = int(os.environ.get("MAIL_PORT", "587"))
username = os.environ["MAIL_USERNAME"]
password = os.environ["MAIL_PASSWORD"]
to_addr = os.environ["MAIL_TO"]
subject = os.environ.get("MAIL_SUBJECT", "[Wiki 자동화] 완료 보고")

body_file = os.environ.get("MAIL_BODY_FILE")
if body_file and os.path.exists(body_file):
    with open(body_file, encoding="utf-8") as f:
        body = f.read()
elif not sys.stdin.isatty():
    body = sys.stdin.read()
else:
    body = os.environ.get("MAIL_BODY", "(본문 없음)")

msg = MIMEMultipart("alternative")
msg["Subject"] = subject
msg["From"] = username
msg["To"] = to_addr
msg.attach(MIMEText(body, "plain", "utf-8"))

try:
    with smtplib.SMTP(host, port) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(username, password)
        server.sendmail(username, [to_addr], msg.as_string())
    print(f"메일 전송 완료: {to_addr}")
except Exception as e:
    print(f"메일 전송 실패: {e}", file=sys.stderr)
    sys.exit(1)
