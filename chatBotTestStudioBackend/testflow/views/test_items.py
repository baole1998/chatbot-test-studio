from django.utils.decorators import method_decorator
from django.http import JsonResponse
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.views import APIView
from rest_framework.response import Response

from ..serializers.test_items import GetTestItemsSerializer, TestQuestionsSerializer, ItemResultsSerializer, TestItemsSerializer
from ..models import TestQuestions, TestItems, ItemResults

@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list test items",
                                                             operation_description="Get list test items"))
@method_decorator(name='create', decorator=swagger_auto_schema(operation_id="Create new test items",
                                                               operation_description="Create new test items"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='update', decorator=swagger_auto_schema(operation_id="Update test items",
                                                               operation_description="Update test items"))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(auto_schema=None))

class TestItemsViewSet(viewsets.ModelViewSet):
    serializer_class = TestItemsSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = TestItems.objects.all()
        return queryset

    def list(self, request, *args, **kwargs):
        code = self.request.query_params.get("code")
        queryset = TestItems.objects.filter(case_code=code)
        serializer = GetTestItemsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list test questions",
                                                             operation_description="Get list test questions"))
@method_decorator(name='create', decorator=swagger_auto_schema(operation_id="Create list test questions",
                                                               operation_description="Create list test questions"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(operation_id="Delete test questions",
                                                               operation_description="Delete test questions"))

class TestQuestionsViewSet(viewsets.ModelViewSet):
    serializer_class = TestQuestionsSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = TestQuestions.objects.all()
        return queryset

    def fiter_queryset(self, pk):
        queryset = TestQuestions.objects.get(pk=pk) 
        return queryset
    
    def create(self, request, *args, **kwargs):
        questions_list = request.data.get('question')
        item_id = request.data.get('item_id')
        for question in questions_list:
            data = {'item_id': item_id, 'question': question}
            serializer = self.get_serializer(data=data)
            if serializer.is_valid(raise_exception=True):
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
            else: 
                return JsonResponse({'error_message': 'create_error !', 'errors_code': 400}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, pk=None):
        item_list = request.data
        try:
            for item in item_list:
                serializer = self.get_serializer(data=item)
                if serializer.is_valid(raise_exception=True):
                    record = self.fiter_queryset(item['id'])
                    record.delete()
        except TestQuestions.DoesNotExist:
            return Response(serializer.data, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
        
@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list test items results",
                                                             operation_description="Get list test items results"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))

class ItemResultsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ItemResultsSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = ItemResults.objects.all()
        return queryset