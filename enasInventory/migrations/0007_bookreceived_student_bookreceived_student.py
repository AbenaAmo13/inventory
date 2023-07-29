# Generated by Django 4.1.9 on 2023-07-07 17:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("enasInventory", "0006_book_quantity_received"),
    ]

    operations = [
        migrations.CreateModel(
            name="BookReceived",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "book",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="enasInventory.book",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Student",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("year_group", models.CharField(max_length=20)),
                ("paid_status", models.BooleanField(default=False)),
                (
                    "books_received",
                    models.ManyToManyField(
                        through="enasInventory.BookReceived", to="enasInventory.book"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="bookreceived",
            name="students",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="enasInventory.students"
            ),
        ),
    ]