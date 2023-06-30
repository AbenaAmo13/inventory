import http

import pandas
import requests
import pandas as pd
from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import render, redirect
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
    # Get all the books data.
    books = Book.objects.all().order_by('-date_requested').values()
    return render(request, 'dashboard.html', {'books_data': books, 'edit_mode': False})


def dashboard_reload(request):
    books = Book.objects.all().order_by('-date_requested').values()
    return render(request, 'dashboard_reload.html', {'books_data': books, 'edit_mode': False})


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


# Update order status of one book
def update_order_status(book_id):
    selected_book = Book.objects.get(id=book_id)
    current_order_status = selected_book.order_status
    if current_order_status == "REQUESTED":
        selected_book.order_status = "ORDERED"
    if current_order_status == "ORDERED":
        selected_book.order_status = "RECEIVED"
    selected_book.save()
    print("The selected book status is " + current_order_status)


def save_edit_made(request, book_id):
    print('The book you are editting has an id of: ' + book_id)
    isbn = request.POST.get('isbn')

    book_name = request.POST.get('book_name')


def table_actions(request):
    if request.method == 'POST':
        print(request.POST)
        book_selection_id = request.POST.get('books_selection')
        action = request.POST.get('table_action', None)
        if action == "update_order_status":
            print("The id is: " + book_selection_id)
            update_order_status(book_selection_id)
        if action == "update_all_statuses":
            book_selection_ids = request.POST.getlist('books_selection')
            print("The ids are: " + str(book_selection_ids))
            for book_id in book_selection_ids:
                print(book_id)
                update_order_status(book_id)
        if action == "save":
            save_edit_made(request, book_selection_id)

        return redirect('dashboard')


# def table_actions(request):
#     if request.method == 'POST':
#         ordered_ids = request.POST.getlist('orders_to_order')
#         received_ids = request.POST.getlist('orders_to_receive')
#
#         for book_id in ordered_ids:
#             book = Book.objects.get(id=book_id)
#             book.order_status = 'ORDERED'
#             book.save()
#
#         for book_id in received_ids:
#             book = Book.objects.get(id=book_id)
#             book.order_status = 'RECEIVED'
#             book.save()
#
#         # Fetch the books_data to render the page again
#     books_data = Book.objects.all().order_by('-date_requested').values()
#     context = {'books_data': books_data}
#     action = request.POST.get('actions', None)
#     if action == 'edit_quantity':
#         print(request.POST)
#         # item_id = request.POST.get('edit_item_id', None)
#         # edited_quantity = request.POST.get(f'edit_quantity_{item_id}', None)
#         # print(edited_quantity)
#         # item_id = request.POST.get('edit_item_id', None)
#         # print(item_id)
#         return render(request, 'dashboard.html', {'books_data': books_data, 'edit_mode': 49})
#     return redirect('/dashboard')


def edit_table(request):
    return

    # return render(request, 'dashboard.html', {'books_data': context})
