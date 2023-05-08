from django import template
from django.utils.safestring import mark_safe
import json

register = template.Library()

@register.filter
def to_json(value):
    return mark_safe(json.dumps(value))
