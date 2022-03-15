from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import Group



class Account(AbstractUser):
    last_login = models.DateTimeField(null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, verbose_name=('Vai trò'), default=None, editable=True,
                               null=True, blank=True)
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

