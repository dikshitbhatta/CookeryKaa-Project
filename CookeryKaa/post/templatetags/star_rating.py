from django import template

register = template.Library()

@register.filter
def star_rating(value):
    full_stars = int(value)
    half_star = value - full_stars >= 0.5
    empty_stars = 5 - full_stars - (1 if half_star else 0)
    return {'full_stars': range(full_stars), 'half_star': half_star, 'empty_stars': range(empty_stars)}
    
@register.filter
def times(n):
    return range(n)