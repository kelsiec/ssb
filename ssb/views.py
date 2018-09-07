from django.shortcuts import render


def entry(request):
    return render(request, 'site_base.html', {})
