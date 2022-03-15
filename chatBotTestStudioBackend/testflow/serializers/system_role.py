from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from ..models import SystemRoles


class SystemRolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemRoles
        fields = ['id', 'system_code', 'username']
