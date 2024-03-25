from django.db import models
from books.models import Book

class Student(models.Model):
    name = models.CharField(max_length=100)
    year_group = models.CharField(max_length=20)
    paid_status = models.BooleanField(default=False)
    books_received = models.ManyToManyField('books.Book', through='BookReceived', related_name='students')

    def __str__(self):
        return self.name

class BookReceived(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    date_received = models.DateTimeField()
