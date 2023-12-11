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
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from . import views
from .views import LoginUserView
from django.contrib.auth.views import LogoutView 

from .middleware import login_exempt
from django.contrib.auth.decorators import login_required


urlpatterns = [
                  path("enas-inventory-admin/", admin.site.urls),
                  path('accounts/', include('django.contrib.auth.urls')),
                  path('login/', LoginUserView.as_view(), name='login'),
                  path('logout/', LogoutView.as_view(next_page='login'),name='logout'),
                  path('', views.index, name='index'),
                  path('add_account/', views.add_account_index, name='add_account'),
                  path('account_setup', views.account_setup, name='account_setup'),
                  # Other URL patterns
                  path('students/', include('students.urls')),
                  path('books/', include('books.urls'))

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
