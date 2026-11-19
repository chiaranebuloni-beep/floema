"""Contatori mostrati accanto alle voci del menu laterale."""


def badge_new_orders(request):
    from orders.models import Order

    count = Order.objects.filter(status=Order.Status.NEW).count()
    return f"{count} nuov{'o' if count == 1 else 'i'}" if count else None


def badge_unanswered_contacts(request):
    from contacts.models import ContactMessage

    count = ContactMessage.objects.filter(answered=False).count()
    return f"{count} nuov{'o' if count == 1 else 'i'}" if count else None


def badge_to_ship(request):
    from django.db.models import Q
    from orders.models import Order

    count = (Order.objects.filter(Q(payment_status=Order.Payment.PAID) | Q(is_test=True))
             .filter(status__in=[Order.Status.NEW, Order.Status.IN_PRODUCTION]).count())
    return f"{count} da spedire" if count else None
