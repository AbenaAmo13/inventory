import http
from io import BytesIO

import pandas
from django.db.models import Q
import requests
import pandas as pd
import json
from datetime import datetime
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required


from enasInventory.forms.forms import BooksYearGroupFilterForm, BooksSearchForm, StatusFiltering
from books.models import Book



def dashboard(request):
    # Get all the books data.
    filter_form = BooksYearGroupFilterForm(request.GET or None)  # Instantiate the form with the submitted data, if any
    book_search_form = BooksSearchForm(request.GET or None)
    status_form = StatusFiltering(request.GET or None)
    books = Book.objects.all().order_by('-date_requested').values()
    if filter_form.is_valid():
        year_group = filter_form.cleaned_data['year_group']
        if year_group:
            books = Book.objects.filter(year_group=year_group)
    if book_search_form.is_valid():
        books_search = book_search_form.cleaned_data['books_query']
        books = books.filter(Q(book_name__icontains=books_search) | Q(isbn__icontains=books_search))
    if status_form.is_valid():
        status_filtering = status_form.cleaned_data['status_filtering']
        if status_filtering:
            books = Book.objects.filter(order_status=status_filtering)
    return render(request, 'new_dashboard.html', {'books_data': books, 'edit_mode': False, 'filter_form': filter_form,
                                              'books_search_form': book_search_form, 'status_form': status_form})





def book_validation(dictionary):
    for key in dictionary:
        value = dictionary[key]
        print(value)

    return None


def add_book_entry(request):
    if request.method == 'POST':
        book_validation(request.POST)
        isbn = request.POST.get('isbn')
        book_name = request.POST.get('book_name')
        quantity_requested = request.POST.get('quantity_requested')
        year_group = request.POST.get('year_group')
        order_status = request.POST.get('order_status')
        quantity_received = request.POST.get('quantity_received')
        date_added = request.POST.get('date_added')
        new_book_entry = Book(book_name=book_name, isbn=isbn, quantity_needed=quantity_requested,
                              quantity_received=quantity_received,
                              year_group=year_group, order_status=order_status, date_requested=date_added)
        new_book_entry.save()
    # Redirect to the dashboard page using JavaScript
    return redirect('dashboard')


def add_books(request):
    try:
        if request.FILES['books_inventory']:
            file = request.FILES['books_inventory']
            if file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                excel_file = pd.ExcelFile(file)
                sheet_names = excel_file.sheet_names
                print(sheet_names)
                for sheet in sheet_names:
                    read_excel_file = pandas.read_excel(file, sheet)
                    for _, book in read_excel_file.iterrows():
                        if not isinstance(book['isbn'], int):
                            isbn = ''.join([i for i in book['isbn'] if i.isalnum()])
                        else:
                            isbn = book['isbn']
                        saved_book = Book(
                            isbn=isbn,
                            book_name=book['book_name'],
                            quantity_needed=int(book['quantity_needed']),
                            quantity_received=0,
                            year_group=sheet,
                            date_requested=datetime.utcnow(),
                            order_status='REQUESTED'
                        )
                        saved_book.save()
            return redirect('dashboard')
    except Exception as e:
        print(str(e))
        return redirect('dashboard')


def update_all_order_status(book_id):
    selected_book = Book.objects.get(id=book_id)
    current_order_status = selected_book.order_status
    if current_order_status == 'ORDERED':
        selected_book.order_status = "RECEIVED"
        quantity_needed = selected_book.quantity_needed
        selected_book.quantity_received = quantity_needed
    elif current_order_status == 'REQUESTED':
        selected_book.order_status = "ORDERED"
    selected_book.save()
    return redirect('dashboard')


def delete_all_selected(book_id):
    selected_book = Book.objects.get(id=book_id)
    selected_book.delete()


def update_order_status(request):
    if request.method == "POST":
        book_id = request.POST.get('book_id')
        updated_order_status = request.POST.get('order_status')
        selected_book = Book.objects.get(id=book_id)
        selected_book.order_status = updated_order_status
        if updated_order_status == 'RECEIVED':
            quantity_needed = selected_book.quantity_needed
            selected_book.quantity_received = quantity_needed
        selected_book.save()
        return redirect('dashboard')


def bulk_delete(request):
    if request.method == "POST":
        return redirect('dashboard')


def save_edit_made(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        # selected_book = Book.objects.get(id=book_id)
        isbn = request.POST.get('isbn')
        book_name = request.POST.get('book_name')
        quantity_requested = request.POST.get('quantity_requested')
        quantity_received = request.POST.get('quantity_received')
        year_group = request.POST.get('year_group')
        Book.objects.filter(id=book_id).update(book_name=book_name, isbn=isbn, quantity_needed=quantity_requested,
                                               quantity_received=quantity_received,
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
        if action == "update_all_statuses":
            book_selection_ids = request.POST.getlist('books_selection')
            # print(book_selection_ids)
            # print("The ids are: " + str(book_selection_ids))
            for book_id in book_selection_ids:
                update_all_order_status(book_id)
        if action == "delete_all":
            book_selection_ids = request.POST.getlist('books_selection')
            for ids in book_selection_ids:
                delete_all_selected(ids)
            # book_selection = request.POST.get()

    return redirect('dashboard')
