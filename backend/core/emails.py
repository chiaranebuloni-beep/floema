"""Email al cliente: conferma d'ordine e avviso di spedizione."""

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

SUBJECTS = {
    "order_confirmation": "Conferma ordine {ref}",
    "order_shipped": "Il tuo ordine {ref} è in viaggio",
}


def send_order_email(order, template):
    context = {"order": order, "store_email": settings.STORE_EMAIL}
    subject = SUBJECTS[template].format(ref=order.reference)
    text = render_to_string(f"emails/{template}.txt", context)
    html = render_to_string("emails/base.html", {**context, "subject": subject,
                                                 "body": render_to_string(f"emails/{template}.html", context)})
    message = EmailMultiAlternatives(subject, text, settings.DEFAULT_FROM_EMAIL, [order.email], reply_to=[settings.STORE_EMAIL])
    message.attach_alternative(html, "text/html")
    message.send(fail_silently=True)
