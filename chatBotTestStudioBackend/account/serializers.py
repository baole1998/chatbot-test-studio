from rest_framework import serializers
from account.models import Account
from django.contrib.auth.models import Group


class AccountSerializers(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields =  [
            'username',
            'password',
            'group',
        ]

class GroupSerializers(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            'id',
            'name',
        ]

class CreateAdminUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'username',
            'password',
            'group',
            'is_superuser',
            'is_staff',
        ]