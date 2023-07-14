import os

import pandas
import pandas as pd
from django.db.models import Q
from django.http import FileResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
import json
from django.templatetags.static import static
from enasInventory.forms.student import SearchStudentForm, YearGroupFilterForm, StudentBookForm, BookReceivedForm
from enasInventory.models import Student
from enasInventory.models import Book
from enasInventory.models import BookReceived
from django.utils import timezone
from datetime import datetime
from django.db import IntegrityError


def add_student_entry(request):
    if request.method == 'POST':
        student_name = request.POST.get('student_name')
        year_group = request.POST.get('year_group')
        try:
            new_student = Student(name=student_name, year_group=year_group, paid_status=False)
            new_student.save()
            return redirect('students:students_book')
        except IntegrityError:
            # Handle the IntegrityError if needed
            pass

    # Handle other cases or display an error message
    return HttpResponse("Error occurred while adding a student.")


def student_books(request):
    search_form = SearchStudentForm(request.GET or None)
    filter_form = YearGroupFilterForm(request.GET or None)  # Instantiate the form with the submitted data, if any
    students = Student.objects.all()
    if filter_form.is_valid():
        year_group = filter_form.cleaned_data['year_group']
        students = Student.objects.all()

        if year_group:
            students = students.filter(year_group=year_group)

    if search_form.is_valid():
        print(search_form)
        search_query = search_form.cleaned_data['search_student_query']
        if search_query:
            students = students.filter(name__icontains=search_query)

    students_data = students.values()

    return render(request, 'students-book.html',
                  {'students_data': students_data, 'filter_form': filter_form, 'search_form': search_form})


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
        return redirect('students:students_book')
    return redirect('students:students_book')


def edit_student_row(request):
    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        student_name = request.POST.get('student_name')
        year_group = request.POST.get('year_group')
        Student.objects.filter(id=student_id).update(name=student_name, year_group=year_group)
    return redirect('students:students_book')


def update_paid_status(request):
    if request.method == 'POST':
        book_id = request.POST.get('student_id')
        Student.objects.filter(id=book_id).update(paid_status=True)
    return redirect('students:students_book')


def update_all_paid(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        student_ids = data['student_ids']
        for ids in student_ids:
            Student.objects.filter(id=ids).update(paid_status=True)
    return redirect('students:students_book')


def delete_student_row(request):
    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        selected_student = Student.objects.get(id=student_id)
        selected_student.delete()
    return redirect('students:students_book')


def download_template(request):
    # Get the file path of the template Excel file using the static() helper function
    template_file_path = os.path.join(static('excel_templates'), 'student_template.xlsx')

    # Open the file using FileResponse and set the appropriate content type
    response = FileResponse(open(template_file_path, 'rb'),
                            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    # Set the Content-Disposition header to force download with the original filename
    response['Content-Disposition'] = 'attachment; filename="student_template.xlsx"'
    return response


def student_detail(request, pk):
    student = get_object_or_404(Student, pk=pk)
    student_year_group = student.year_group
    year_books = Book.objects.filter(year_group=student_year_group)
    received_books = BookReceived.objects.filter(student=student)
    received_books_list = list(received_books.values_list('book_id', flat=True))
    print(received_books_list)
    # not_received_books = Book.objects.filter(~Q(id__in=received_books))
    not_received_books = year_books.exclude(id__in=received_books_list)
    print('The books not received' + str(not_received_books))
    book_form = StudentBookForm(request.POST or None)

    if request.method == "POST":
        if book_form.is_valid():
            isbn = book_form.cleaned_data['isbn_name']
            book_name = book_form.cleaned_data['book_name']
            order_status = "REQUESTED"
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
            print(current_time)
            quantity_needed = 1
            quantity_received = 0
            new_book = Book(book_name=book_name, isbn=isbn, quantity_needed=quantity_needed,
                            quantity_received=quantity_received,
                            year_group=student_year_group, order_status=order_status, date_requested=current_time)
            new_book.save()
    return render(request, 'student_detail.html',
                  {
                      'student': student,
                      'books': year_books,
                      'book_form': book_form,
                      'received_books': received_books,
                      'not_received_books': not_received_books,
                  })


def update_received_books(request):
    student_id = request.POST.get('student_id')
    book_id = request.POST.get('book_id')
    date_received = timezone.now()
    new_received_book = BookReceived(book_id=book_id, student_id=student_id, date_received=date_received)
    new_received_book.save()
    return redirect('students:student_detail', student_id)
