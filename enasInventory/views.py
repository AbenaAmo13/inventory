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


def add_book_entry(request):
    if request.method == 'POST':
        isbn = request.POST.get('isbn')
        book_name = request.POST.get('book_name')
        quantity_requested = request.POST.get('quantity_requested')
        year_group = request.POST.get('year_group')
        order_status = request.POST.get('order_status')
        date_added = request.POST.get('date_added')
        new_book_entry = Book(book_name=book_name, isbn=isbn, quantity_needed=quantity_requested,
                              year_group=year_group, order_status=order_status, date_requested=date_added)
        new_book_entry.save()
    # Redirect to the dashboard page using JavaScript
    return redirect('dashboard')


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


def update_order_status(request):
    if request.method == "POST":
        book_id = request.POST.get('book_id')
        updated_order_status = request.POST.get('order_status')
        selected_book = Book.objects.get(id=book_id)
        selected_book.order_status = updated_order_status
        selected_book.save()
        return redirect('dashboard')


def save_edit_made(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        # selected_book = Book.objects.get(id=book_id)
        isbn = request.POST.get('isbn')
        book_name = request.POST.get('book_name')
        quantity_requested = request.POST.get('quantity_requested')
        year_group = request.POST.get('year_group')
        Book.objects.filter(id=book_id).update(book_name=book_name, isbn=isbn, quantity_needed=quantity_requested,
                                               year_group=year_group)

    return redirect('dashboard')


def delete_book_item(request):
    if request.method == 'POST':
        selected_book_id = request.POST.get('book_id')
        selected_book = Book.objects.get(id=selected_book_id)
        selected_book.delete()
    return redirect('dashboard')


def table_actions(request):
    if request.method == 'POST':
        print(request.POST)
        book_selection_id = request.POST.get('books_selection')
        action = request.POST.get('table_action', None)
        # if action == "update_order_status":
        #     print("The id is: " + book_selection_id)
        #     update_order_status(book_selection_id)
        if action == "update_all_statuses":
            book_selection_ids = request.POST.getlist('books_selection')
            print("The ids are: " + str(book_selection_ids))
            for book_id in book_selection_ids:
                print(book_id)
                update_order_status(book_id)
        if action == "delete":
            print(request.POST)
            # book_selection = request.POST.get()

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


# return render(request, 'dashboard.html', {'books_data': context})
