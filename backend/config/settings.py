"""Backend FLOEMA Wood Studio: prodotti, ordini, clienti e newsletter del sito."""

import os
from pathlib import Path

import dj_database_url

from django.templatetags.static import static
from django.urls import reverse_lazy
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DEBUG = os.getenv("DJANGO_DEBUG", "1") == "1"
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or ("dev-only-floema-change-me" if DEBUG else None)
if not SECRET_KEY:
    raise RuntimeError("In produzione serve DJANGO_SECRET_KEY.")
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
CSRF_TRUSTED_ORIGINS = [f"https://{host}" for host in ALLOWED_HOSTS if host not in ("localhost", "127.0.0.1")]

if not DEBUG:
    # Online (Vercel): solo HTTPS e cookie protetti.
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30
    SECURE_CONTENT_TYPE_NOSNIFF = True

# Sito pubblico (Next.js): anteprime immagini e link «Vedi sul sito».
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3100")
# Se impostata, il sito deve inviarla nell'header X-Floema-Key per creare ordini.
FRONTEND_API_KEY = os.getenv("FRONTEND_API_KEY", "")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

STORE_NAME = "FLOEMA Wood Studio"
STORE_EMAIL = os.getenv("STORE_EMAIL", "info@floema.it")
ORDER_PREFIX = "FL-"

INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "core",
    "catalog",
    "orders",
    "contacts",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# In locale SQLite; online il Postgres di Vercel (Neon) tramite DATABASE_URL.
DATABASES = {
    "default": dj_database_url.config(default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}", conn_max_age=0, conn_health_checks=True)
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
]

LANGUAGE_CODE = "it"
LOCALE_PATHS = [BASE_DIR / "locale"]
TIME_ZONE = "Europe/Rome"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
# I file statici dell'admin vengono serviti direttamente dalle app, senza passaggio di build.
WHITENOISE_USE_FINDERS = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Email: in locale vengono stampate nel terminale; in produzione basta impostare EMAIL_HOST & co.
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
# Su Railway (piano Hobby) le porte SMTP sono bloccate: si usa l'API di Brevo, EMAIL_BACKEND=core.brevo.BrevoAPIBackend.
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", f"{STORE_NAME} <ordini@floema.it>")

# Contatori del menu: testo esplicito su fondo scuro, al posto del numero rosso predefinito.
BADGE = {"badge_variant": "default", "badge_style": "solid", "badge_class": "fl-badge"}

UNFOLD = {
    "SITE_TITLE": "FLOEMA Admin",
    "SITE_HEADER": "FLOEMA",
    "SITE_SUBHEADER": "Wood Studio",
    "SITE_URL": FRONTEND_URL,
    "SITE_ICON": {
        "light": lambda request: static("floema/logo-mark.svg"),
        "dark": lambda request: static("floema/logo-mark-light.svg"),
    },
    "SITE_FAVICONS": [
        {"rel": "icon", "sizes": "any", "type": "image/svg+xml", "href": lambda request: static("floema/logo-mark.svg")},
    ],
    "STYLES": [lambda request: static("floema/admin.css")],
    "LOGIN": {"image": lambda request: static("floema/login.jpg")},
    # Admin chiaro e neutro (grigi puri, niente toni bruni), con l'antracite del marchio come colore principale.
    "COLORS": {
        "base": {
            "50": "#fafafa", "100": "#f5f5f5", "200": "#e5e5e5", "300": "#d4d4d4", "400": "#a3a3a3",
            "500": "#737373", "600": "#525252", "700": "#404040", "800": "#262626", "900": "#171717", "950": "#0a0a0a",
        },
        "primary": {
            "50": "#f5f5f5", "100": "#e5e5e5", "200": "#d4d4d4", "300": "#a3a3a3", "400": "#737373",
            "500": "#404040", "600": "#1e1e1e", "700": "#171717", "800": "#141414", "900": "#0a0a0a", "950": "#050505",
        },
    },
    "SIDEBAR": {
        "show_search": False,
        "show_all_applications": False,
        "navigation": [
            {
                "items": [
                    # Clienti e Varianti non hanno una voce propria: sono schede dentro Ordini e Prodotti (vedi TABS).
                    {"title": "Ordini", "icon": "receipt_long", "link": reverse_lazy("admin:orders_order_changelist"),
                     "badge": "core.callbacks.badge_new_orders", **BADGE},
                    {"title": "Spedizioni", "icon": "local_shipping", "link": reverse_lazy("admin:orders_shipment_changelist"),
                     "badge": "core.callbacks.badge_to_ship", **BADGE},
                    {"title": "Prodotti", "icon": "chair", "link": reverse_lazy("admin:catalog_product_changelist")},
                    {"title": "Lead dal sito", "icon": "mail", "link": reverse_lazy("admin:contacts_contactmessage_changelist"),
                     "badge": "core.callbacks.badge_unanswered_contacts", **BADGE},
                    {"title": "Utenti staff", "icon": "badge", "link": reverse_lazy("admin:auth_user_changelist")},
                ],
            },
        ],
    },
    "TABS": [
        {
            "models": ["orders.order", "orders.customer"],
            "items": [
                {"title": "Ordini", "link": reverse_lazy("admin:orders_order_changelist")},
                {"title": "Clienti", "link": reverse_lazy("admin:orders_customer_changelist")},
            ],
        },
        {
            "models": ["catalog.product", "catalog.variant"],
            "items": [
                {"title": "Prodotti", "link": reverse_lazy("admin:catalog_product_changelist")},
                {"title": "Varianti", "link": reverse_lazy("admin:catalog_variant_changelist")},
            ],
        },
    ],
}
