from django import forms

from enasInventory.models import BookReceived


class YearGroupFilterForm(forms.Form):
    year_group = forms.ChoiceField(
        choices=[
            ('', 'All'),
            ('Reception', 'Reception'),
            ('Nursery', 'Nursery'),
            ('Year 1', 'Year 1'),
            ('Year 2', 'Year 2'),
            ('Year 3', 'Year 3'),
            ('Year 4', 'Year 4'),
            ('Year 5', 'Year 5'),
            ('Year 6', 'Year 6'),
            ('Year 7', 'Year 7'),
            ('Year 8', 'Year 8'),
            ('Year 9', 'Year 9'),
            ('Year 10', 'Year 10'),
            ('Year 11', 'Year 11'),
            ('Year 12', 'Year 12'),
        ],
        required=False,
        label='Select a class:'
    )


class BooksYearGroupFilterForm(forms.Form):
    year_group = forms.ChoiceField(
        choices=[
            ('', 'All'),
            ('Reception', 'Reception'),
            ('Nursery', 'Nursery'),
            ('Primary', 'Primary'),
            ('Secondary', 'Secondary'),
            ('IGCSE', 'Year 3'),
            ('Year 4', 'Year 4'),
            ('Year 5', 'Year 5'),
            ('Year 6', 'Year 6'),
            ('Year 7', 'Year 7'),
            ('Year 8', 'Year 8'),
            ('Year 9', 'Year 9'),
            ('Year 10', 'Year 10'),
            ('Year 11', 'Year 11'),
            ('Year 12', 'Year 12'),
            ('IGCSE', 'IGCSE'),
            ('A-level', 'A-level'),

        ],
        required=False,
        label='Select a year group to filter the books:'
    )


class SearchStudentForm(forms.Form):
    search_student_query = forms.CharField(
        label='Search',
        widget=forms.TextInput(attrs={'placeholder': 'Search Student Record Here'}),
        required=False
    )


class StudentBookForm(forms.Form):
    isbn_name = forms.CharField(
        label='ISBN',
        required=True
    )
    book_name = forms.CharField(
        label='Book Name',
        required=True
    )


class BookReceivedForm(forms.ModelForm):
    class Meta:
        model = BookReceived
        fields = ['student', 'book', 'date_received']
