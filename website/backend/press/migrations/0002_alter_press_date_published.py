# Generated by Django 4.1.7 on 2023-07-03 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('press', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='press',
            name='date_published',
            field=models.DateField(),
        ),
    ]