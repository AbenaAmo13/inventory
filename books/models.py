from django.db import models


class Book(models.Model):
    isbn = models.IntegerField()
    book_name = models.CharField(max_length=255)
    year_group = models.CharField(max_length=255)
    date_requested = models.DateTimeField()
    order_status = models.CharField(max_length=255)
    quantity_needed = models.IntegerField()
    quantity_received = models.IntegerField()
    def __str__(self):
        return self.book_name

