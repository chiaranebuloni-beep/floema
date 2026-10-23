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
    # Colori del sito (src/app/globals.css): crema, avorio, sabbia, tortora, fango, carbone, antracite.
    "COLORS": {
        "base": {
            "50": "#faf8f4", "100": "#f6f2ec", "200": "#eee7de", "300": "#d8c8b8", "400": "#a29686",
            "500": "#6f665b", "600": "#4d4740", "700": "#3a3631", "800": "#2a2c2a", "900": "#1e1e1e", "950": "#141414",
        },
        "primary": {
            "50": "#f6f2ec", "100": "#eee7de", "200": "#d8c8b8", "300": "#bdb0a1", "400": "#a29686",
            "500": "#6f665b", "600": "#1e1e1e", "700": "#2a2c2a", "800": "#1e1e1e", "900": "#141414", "950": "#0a0a0a",
        },
    },
    "SIDEBAR": {
        "show_search": False,
        "show_all_applications": False,
        "navigation": [
            {
                "items": [
                    {"title": "Ordini", "icon": "receipt_long", "link": reverse_lazy("admin:orders_order_changelist"),
                     "badge": "core.callbacks.badge_new_orders", **BADGE},
                    {"title": "Clienti", "icon": "group", "link": reverse_lazy("admin:orders_customer_changelist")},
                    {"title": "Prodotti", "icon": "chair", "link": reverse_lazy("admin:catalog_product_changelist")},
                    {"title": "Varianti", "icon": "palette", "link": reverse_lazy("admin:catalog_variant_changelist")},
                    {"title": "Contatti", "icon": "mail", "link": reverse_lazy("admin:contacts_contactmessage_changelist"),
                     "badge": "core.callbacks.badge_unanswered_contacts", **BADGE},
                    {"title": "Utenti staff", "icon": "badge", "link": reverse_lazy("admin:auth_user_changelist")},
                ],
            },
        ],
    },
}
