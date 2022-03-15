from rest_framework import serializers
# from rest_framework.validators import UniqueTogetherValidator
from ..models import TestSuites, TestSuiteResults
from .chat_systems import ChatSystemsSerializer


class GetTestSuitesSerializer(serializers.ModelSerializer):
    systems_code = ChatSystemsSerializer()
    class Meta:
        model = TestSuites
        # fields = '__all__'
        exclude = ['create_time', 'update_time']

class TestSuitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestSuites
        # fields = '__all__'
        exclude = ['create_time', 'update_time']

class TestSuiteResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestSuiteResults
        # fields = '__all__'
        exclude = ['create_time', 'update_time']
