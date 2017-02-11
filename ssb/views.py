from django import forms
from django.http import HttpResponse
from django.shortcuts import render, render_to_response
from django.utils.html import escape


def home(request):
    return render(request, 'home.html', {})


def handle_pop_add(request, add_form, field):
    if request.method == "POST":
        form = add_form(request.POST)
        if form.is_valid():
            form.save()

    # if instance is not None:
    #     return HttpResponse(
    #         '<script type="text/javascript">opener.dismissAddAnotherPopup(window, "{}", "{}");</script>'.format(
    #             escape(instance.pk), escape(instance))
    #     )
    form = add_form()
    ctx = {'form': form, 'field': field}
    return render_to_response("popup_add.html", ctx)
