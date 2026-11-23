"""Email al cliente: conferma d'ordine e avviso di spedizione."""

from urllib.parse import quote

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

SUBJECTS = {
    "order_confirmation": "Conferma ordine {ref}",
    "order_shipped": "Il tuo ordine {ref} è in viaggio",
}
# Testo di anteprima mostrato dalle caselle di posta accanto all'oggetto.
PREHEADERS = {
    "order_confirmation": "Abbiamo ricevuto il tuo ordine: ecco il riepilogo.",
    "order_shipped": "Il tuo FLOEMA ha lasciato il laboratorio di Livigno.",
}
# Stessi dati del footer del sito (src/lib/company.ts).
COMPANY = "Falegnameria Galli di Galli Alex · Via All, 138, 23041 Livigno (SO) · P.IVA 01019410149"


def _image_url(site_url, path):
    """Foto ridimensionata dal sito (Next.js), così l'email resta leggera."""
    if not path:
        return ""
    if path.startswith("http"):
        return path
    return f"{site_url}/_next/image?url={quote(path, safe='')}&w=640&q=75"


def _line_image(line):
    """Foto della colorazione scelta (es. Naturale), se c'è; altrimenti quella di copertina salvata nell'ordine."""
    if line.product_id and line.variant_name:
        names = [n.strip() for n in line.variant_name.split("·")]
        image = line.product.images.filter(variant__name__in=names).first()
        if image:
            return image.path
    return line.image


def _context(order):
    site_url = settings.FRONTEND_URL.rstrip("/")
    lines = [
        {"name": line.product_name, "variant": line.variant_name, "qty": line.quantity, "total": line.total,
         "image_url": _image_url(site_url, _line_image(line))}
        for line in order.lines.select_related("product")
    ]
    return {
        "order": order, "lines": lines, "store_email": settings.STORE_EMAIL, "site_url": site_url,
        "logo_url": f"{site_url}/email/logo-floema-scuro.png", "company": COMPANY,
        "first_name": order.name.split(" ")[0] if order.name else "",
        # Pagina del sito con lo stato dell'ordine (protetta dal codice dell'ordine, come la pagina di conferma).
        "order_url": f"{site_url}/ordine?order={order.number}&t={order.token}",
    }


def render_order_email(order, template):
    context = _context(order)
    subject = SUBJECTS[template].format(ref=order.reference)
    text = render_to_string(f"emails/{template}.txt", context)
    html = render_to_string("emails/base.html", {
        **context, "subject": subject, "preheader": PREHEADERS[template],
        "body": render_to_string(f"emails/{template}.html", context),
    })
    return subject, text, html


def send_order_email(order, template):
    subject, text, html = render_order_email(order, template)
    message = EmailMultiAlternatives(subject, text, settings.DEFAULT_FROM_EMAIL, [order.email], reply_to=[settings.STORE_EMAIL])
    message.attach_alternative(html, "text/html")
    message.send(fail_silently=True)
