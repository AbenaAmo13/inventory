from django import forms

from students.models import BookReceived

class BookReceivedForm(forms.ModelForm):
    class Meta:
        model = BookReceived
        fields = ['student', 'book', 'date_received']
