import http

import pandas
import requests
import pandas as pd
from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import render
from enasInventory.models import Book


def index(request):
    x = 'Hello'
    return render(request, 'index.html', {'test': x})


def login_post(request):
    username = request.POST['username']
    print(username)
    print(request.POST)
    return HttpResponse(status=200)


def dashboard(request):
    return render(request, 'dashboard.html')


def add_books(request):
    file = request.FILES['books_inventory']
    excel_file = pd.ExcelFile(file)
    sheet_names = excel_file.sheet_names
    print(sheet_names)
    for sheet in sheet_names:
        read_excel_file = pandas.read_excel(file, sheet)
        for _, book in read_excel_file.iterrows():
            if not isinstance(book['isbn'], int):
                isbn = ''.join([i for i in book['isbn'] if i.isalnum()])
            saved_book = Book(
                isbn=isbn,
                book_name=book['book_name'],
                quantity_needed=int(book['quantity_needed']),
                year_group=sheet,
                date_requested=datetime.utcnow(),
                order_status='REQUESTED'
            )
            saved_book.save()
    print(read_excel_file)
    return HttpResponse(status=200)
