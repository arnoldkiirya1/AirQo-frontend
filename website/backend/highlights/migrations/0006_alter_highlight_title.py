# Generated by Django 4.1.1 on 2023-03-01 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('highlights', '0005_alter_highlight_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='highlight',
            name='title',
            field=models.CharField(max_length=110),
        ),
    ]
