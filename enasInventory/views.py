import http
from io import BytesIO

import pandas
import requests
import pandas as pd
import json
from datetime import datetime
from django.shortcuts import render, redirect
from enasInventory.models import Book
from enasInventory.models import Student
from django.http import HttpResponse
from django.http import FileResponse
from django.templatetags.static import static
import os
from .forms.forms import YearGroupFilterForm
from .forms.forms import *


def index(request):
    x = 'Hello'
    return render(request, 'index.html', {'test': x})


def login_post(request):
    username = request.POST['username']
    print(username)
    print(request.POST)
    return HttpResponse(status=200)



