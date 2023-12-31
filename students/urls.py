from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    # Other URL patterns
    path('add_students_bulk', views.add_students_bulk),
    path('add_student_entry', views.add_student_entry),
    path('add_first_entry', views.add_new_student_entry),
    path('edit_student_row', views.edit_student_row),
    path('update_paid_status', views.update_paid_status),
    path('update_received_status', views.update_received_books, name='update_received_status'),
    path('update_all_paid', views.update_all_paid),
    path('students_book', views.student_books, name='students_book'),
    path('delete_student_row', views.delete_student_row),
    path('<int:pk>/', views.student_detail, name='student_detail'),
]