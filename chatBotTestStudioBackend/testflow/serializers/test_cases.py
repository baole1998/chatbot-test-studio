from rest_framework import serializers
from ..models import TestCases, CaseResults
from .suites import TestSuitesSerializer
from .test_items import TestItemsSerializer


class GetTestCasesSerializer(serializers.ModelSerializer):
    suite_code = TestSuitesSerializer()
    test_items = TestItemsSerializer(many=True, read_only=True)
    class Meta:
        model = TestCases
        fields = '__all__'
        # exclude = ['create_time', 'update_time']

class TestCasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCases
        fields = '__all__'
        # exclude = ['create_time', 'update_time']

class CaseResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseResults
        fields = '__all__'
