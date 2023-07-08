"""
URL configuration for enasInventory project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views
from django.views.generic import RedirectView

urlpatterns = [
                  path("admin/", admin.site.urls),
                  path('', views.index, name='index'),
                  path('login', views.login_post),
                  path('dashboard', views.dashboard, name='dashboard'),
                  path('add_books', views.add_books),
                  path('add_students_bulk', views.add_students_bulk),
                  path('add_book_entry', views.add_book_entry),
                  path('table_actions', views.table_actions),
                  path('save_edit_made', views.save_edit_made),
                  path('edit_student_row', views.edit_student_row),
                  path('update_order_status', views.update_order_status),
                  path('delete_book_item', views.delete_book_item),
                  path('students_book', views.student_books, name='students_book')
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
