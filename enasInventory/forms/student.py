from django import forms


class YearGroupFilterForm(forms.Form):
    year_group = forms.ChoiceField(
        choices=[
            ('', 'All'),
            ('Reception', 'Reception'),
            ('Nursery', 'Nursery'),
            ('Year 1', 'Year 1'),
            ('Year 2', 'Year 2'),
            ('Year 3', 'Year 3'),
        ],
        required=False,
        label='Select a class:'
    )
