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
from .forms.student import YearGroupFilterForm



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


def student_books(request):
    filter_form = YearGroupFilterForm(request.GET or None)  # Instantiate the form with the submitted data, if any
    if filter_form.is_valid():
        year_group = filter_form.cleaned_data['year_group']
        students = Student.objects.all()

        if year_group:
            students = students.filter(year_group=year_group)
    else:
        students = Student.objects.all()
    students_data = students.values()

    return render(request, 'students-book.html', {'students_data': students_data, 'filter_form': filter_form})


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


def add_student_entry(request):
    if request.method == 'POST':
        print(request.POST)
        student_name = request.POST.get('student_name')
        year_group = request.POST.get('year_group')
        new_student = Student(name=student_name, year_group=year_group, paid_status=False)
        new_student.save()
    return redirect('students_book')


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


def add_students_bulk(request):
    try:
        if request.FILES['student_inventory']:
            file = request.FILES['student_inventory']
            if file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                excel_file = pd.ExcelFile(file)
                sheet_names = excel_file.sheet_names
                print(sheet_names)
                for sheet in sheet_names:
                    read_excel_file = pandas.read_excel(file, sheet)
                    for _, book in read_excel_file.iterrows():
                        saved_students = Student(
                            name=book['student_name'],
                            year_group=sheet,
                            paid_status=False
                        )
                        saved_students.save()
            return redirect('students_book')
    except Exception as e:
        print(str(e))
        return redirect('students_book')
    return redirect('students_book')


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


def edit_student_row(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        student_name = request.POST.get('student_name')
        year_group = request.POST.get('year_group')
        Student.objects.filter(id=book_id).update(name=student_name, year_group=year_group)
    return redirect('students_book')


def update_paid_status(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        Student.objects.filter(id=book_id).update(paid_status=True)
    return redirect('students_book')


def delete_book_item(request):
    if request.method == 'POST':
        selected_book_id = request.POST.get('book_id')
        selected_book = Book.objects.get(id=selected_book_id)
        selected_book.delete()
    return redirect('dashboard')


def delete_student_row(request):
    if request.method == 'POST':
        student_id = request.POST.get('book_id')
        selected_student = Student.objects.get(id=student_id)
        selected_student.delete()
    return redirect('students_book')


def table_actions(request):
    if request.method == 'POST':
        print(request.POST)
        book_selection_id = request.POST.get('books_selection')
        action = request.POST.get('table_action', None)
        if action == "update_all_statuses":
            book_selection_ids = request.POST.getlist('books_selection')
            # print("The ids are: " + str(book_selection_ids))
            for book_id in book_selection_ids:
                update_all_order_status(book_id)
        if action == "delete":
            print(request.POST)
            # book_selection = request.POST.get()

    return redirect('dashboard')


def update_all_paid(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        student_ids = data['student_ids']
        for ids in student_ids:
            student_update = Student.objects.filter(id=ids).update(paid_status=True)
    return redirect('students_book')


def download_template(request):
    # Get the file path of the template Excel file using the static() helper function
    template_file_path = os.path.join(static('excel_templates'), 'student_template.xlsx')

    # Open the file using FileResponse and set the appropriate content type
    response = FileResponse(open(template_file_path, 'rb'),
                            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    # Set the Content-Disposition header to force download with the original filename
    response['Content-Disposition'] = 'attachment; filename="student_template.xlsx"'

    return response

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
