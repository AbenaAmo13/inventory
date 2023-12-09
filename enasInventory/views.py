import http
from io import BytesIO
import os
from django.contrib.auth.models import User
from dotenv import load_dotenv
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate

from django.http import HttpResponse

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


def index(request):
    # Check if a user exists
    return render(request, 'index.html', {'errors': None})
    # if User.objects.all()
    # database_user = os.getenv('USERNAME'),
    # database_password = os.getenv('PASSWORD'),
    # user = User.objects.create_user(database_user[0],'', database_password[0])
    # user.save()


def login_post(request):
    if request.method == 'POST':
        errors = []
        username = request.POST['username']
        password = request.POST['password']
        created_user = authenticate(username=username, password=password)
        if created_user is not None:
            return redirect('dashboard')
        else:
            errors.append('Invalid user credentials')
            return render(request, 'index.html', {'errors': errors})


        #return redirect('dashboard')

