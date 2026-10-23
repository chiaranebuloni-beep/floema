"""Punto d'ingresso per Vercel: tutte le richieste arrivano qui e vengono passate a Django."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config.wsgi import application as app  # noqa: E402
