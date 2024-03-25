from django.contrib import admin
from .models import Book  # Import the model from your app

class BookAdmin(admin.ModelAdmin):
    list_display = ('book_name', 'year_group')
    list_filter = ('year_group', 'order_status')
    fieldsets = (
        (None, {
            'fields': ('isbn', 'book_name', 'year_group')
        }),
        ('Book Order details', {
            'fields': ('order_status', 'quantity_needed', 'quantity_received', 'date_requested')
        }),
    )

admin.site.register(Book, BookAdmin)
