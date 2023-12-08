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


class Student(models.Model):
    name = models.CharField(max_length=100)
    year_group = models.CharField(max_length=20)
    paid_status = models.BooleanField(default=False)
    books_received = models.ManyToManyField('Book', through='BookReceived')

    def __str__(self):
        return self.name


class BookReceived(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    date_received = models.DateTimeField()
