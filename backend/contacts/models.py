from django.db import models


class ContactMessage(models.Model):
    """Richiesta arrivata dal modulo della pagina Contatti."""

    class Profile(models.TextChoices):
        PRIVATE = "privato", "Privato"
        PROFESSIONAL = "professionista", "Professionista"

    name = models.CharField("nome", max_length=160)
    email = models.EmailField("email")
    profile = models.CharField("profilo", max_length=16, choices=Profile.choices, default=Profile.PRIVATE)
    message = models.TextField("messaggio")
    answered = models.BooleanField("risposto", default=False)
    internal_note = models.TextField("note interne", blank=True)
    created_at = models.DateTimeField("ricevuto il", auto_now_add=True)

    class Meta:
        verbose_name = "contatto"
        verbose_name_plural = "contatti"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.created_at:%d/%m/%Y}"
