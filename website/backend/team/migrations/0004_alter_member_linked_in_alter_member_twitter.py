# Generated by Django 4.0.5 on 2022-06-13 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team', '0003_alter_member_options_remove_member_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='member',
            name='linked_in',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='member',
            name='twitter',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
