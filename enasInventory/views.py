import http
from io import BytesIO
import os
from django.contrib.auth.models import User
from dotenv import load_dotenv
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .middleware import login_exempt
from django.urls import reverse
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.views import LoginView



load_dotenv()


def account_setup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Create the user account
        new_user = User.objects.create_user(username, '', password)
        new_user.save()
        return redirect('dashboard')


def add_account_index(request):
    return render(request, 'account_setup.html')


@login_exempt
def index(request):
    #Redirect user to the login page 
     return redirect(reverse('login'))

def login_user(request):
    if request.method == 'POST':
        errors = []
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', 'dashboard')
            return redirect(next_url)
        else:
            errors.append('Invalid user credentials')
            return render(request, 'registration/login.html', {'errors': errors})
        #return redirect('dashboard')

def logout_user(request):
    logout(request)


class LoginUserView(LoginView):
    redirect_authenticated_user = True
    
    def get_success_url(self):
        #Customize the success URL here if needed
        return super().get_success_url()
    
    def form_invalid(self, form):
        messages.error(self.request,'Invalid username or password')
        return self.render_to_response(self.get_context_data(form=form))
    