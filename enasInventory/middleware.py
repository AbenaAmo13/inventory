from django.contrib.auth.decorators import login_required
from django.contrib import admin  # Add this line to import the admin module
from functools import partial
from django.urls import reverse

def login_exempt(view):
    view.login_exempt = True
    return view


class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        if getattr(view_func, 'login_exempt', False):
            return

        if request.user.is_authenticated:
            return
            
        # Check if the view is the login view
        login_url = reverse('login')  # Update with the actual name of your login view
        logout_url = reverse('logout')  # Update with the actual name of your logout view
        if request.path == login_url or request.path== logout_url:
            return

        return login_required(view_func)(request, *view_args, **view_kwargs)

        
        #return login_required(login_url="/accounts/login/")

        # You probably want to exclude the login/logout views, etc.

        #return login_required(view_func, request, *view_args, **view_kwargs)
