from rest_framework import serializers
# from rest_framework.validators import UniqueTogetherValidator
from ..models import TestItems, ItemResults, TestQuestions 

class TestItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestItems
        fields = '__all__'

class ItemResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemResults
        fields = '__all__'
        # exclude = ['create_time', 'update_time']
        
class TestQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestions
        fields = '__all__'
        # exclude = ['create_time', 'update_time', 'item_id']

class BuildTestQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestions
        fields = ['question']
        # exclude = ['create_time', 'update_time', 'item_id']

class BuildTestItemsSerializer(serializers.ModelSerializer):
    questions = BuildTestQuestionsSerializer(many=True, read_only=True)
    class Meta:
        model = TestItems
        fields = ['id', 'questions', 'answer']

class GetTestItemsSerializer(serializers.ModelSerializer):
    questions = TestQuestionsSerializer(many=True, read_only=True)
    class Meta:
        model = TestItems
        fields = '__all__'

