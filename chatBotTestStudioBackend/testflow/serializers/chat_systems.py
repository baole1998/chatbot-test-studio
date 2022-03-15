from rest_framework import serializers
# from rest_framework.validators import UniqueTogetherValidator
from ..models import ChatSystems


class ChatSystemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSystems
        fields = '__all__'
        # exclude = ['create_time', 'update_time']
