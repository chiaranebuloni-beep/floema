"""Invio email con l'API web di Brevo (HTTPS).

Railway, nei piani Free, Trial e Hobby, blocca le porte SMTP (25, 465, 587): per questo le email
non passano dal server SMTP di Brevo ma dalla sua API, sulla porta 443.

Si attiva con EMAIL_BACKEND=core.brevo.BrevoAPIBackend e BREVO_API_KEY (chiave API di Brevo, «xkeysib-…»).
"""

import logging
from email.utils import parseaddr

import requests
from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend

API_URL = "https://api.brevo.com/v3/smtp/email"
logger = logging.getLogger(__name__)


def _contact(address):
    name, email = parseaddr(address)
    return {"email": email, **({"name": name} if name else {})}


def build_payload(message):
    """Traduce un EmailMessage di Django nel formato dell'API di Brevo."""
    payload = {
        "sender": _contact(message.from_email or settings.DEFAULT_FROM_EMAIL),
        "to": [_contact(a) for a in message.to],
        "subject": message.subject,
        "textContent": message.body,
    }
    if message.cc:
        payload["cc"] = [_contact(a) for a in message.cc]
    if message.bcc:
        payload["bcc"] = [_contact(a) for a in message.bcc]
    if message.reply_to:
        payload["replyTo"] = _contact(message.reply_to[0])
    html = next((content for content, mimetype in getattr(message, "alternatives", []) if mimetype == "text/html"), None)
    if html:
        payload["htmlContent"] = html
    return payload


class BrevoAPIBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        api_key = getattr(settings, "BREVO_API_KEY", "")
        sent = 0
        for message in email_messages:
            try:
                if not api_key:
                    raise RuntimeError("Manca BREVO_API_KEY.")
                response = requests.post(API_URL, json=build_payload(message), timeout=15,
                                         headers={"api-key": api_key, "accept": "application/json"})
                if response.status_code >= 400:
                    raise RuntimeError(f"Brevo {response.status_code}: {response.text[:300]}")
                sent += 1
            except Exception:
                # Anche con fail_silently l'errore finisce nei log di Railway, così si capisce perché un'email non parte.
                logger.exception("Email non inviata a %s", ", ".join(message.to))
                if not self.fail_silently:
                    raise
        return sent
