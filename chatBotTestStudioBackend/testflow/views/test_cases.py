from asyncio.log import logger
import json
import os
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status, permissions
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response

from ..serializers.test_cases import GetTestCasesSerializer, CaseResultsSerializer, TestCasesSerializer
from ..serializers.test_items import BuildTestItemsSerializer
from ..models import CaseResults, TestCases, TestItems

@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list test cases",
                                                             operation_description="Get list test cases"))
@method_decorator(name='create', decorator=swagger_auto_schema(operation_id="Create list test cases",
                                                               operation_description="Create list test cases"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='update', decorator=swagger_auto_schema(operation_id="Update test cases",
                                                               operation_description="Update test cases"))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(auto_schema=None))

class TestCasesViewSet(viewsets.ModelViewSet):
    ex_serializer_class = GetTestCasesSerializer
    serializer_class = TestCasesSerializer
    pagination_class = LimitOffsetPagination
    queryset = TestCases.objects.all()

    def get_queryset(self, *args, **kwargs):
        queryset = TestCases.objects.all()
        return queryset
    
    def list(self, request, *args, **kwargs):
        code = self.request.query_params.get("code")
        queryset = TestCases.objects.filter(suite_code=code)
        serializer = self.ex_serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list test case results",
                                                             operation_description="Get list test case results"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))

class CaseResultsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CaseResultsSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = CaseResults.objects.all()
        return queryset


@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list test cases",
                                                             operation_description="Get list test cases"))
@method_decorator(name='create', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(auto_schema=None))

class ControlTesting(viewsets.ModelViewSet):
    """
        This API is a trigger to start testing available scenario (MUST HAVE)
    """
    serializer_class = TestCasesSerializer
    pagination_class = LimitOffsetPagination
    queryset = TestCases.objects.all()

    def get_queryset(self, *args, **kwargs):
        queryset = TestCases.objects.all()
        return queryset
    
    def list(self, *args, **kwargs):
        code = self.request.query_params.get("code")
        queryset = TestItems.objects.filter(case_code=code)
        serializer = BuildTestItemsSerializer(queryset, many=True)
        scenario = []
        for x in serializer.data:
            questions_list = []
            for _key, _value in x.items():
                if _key == 'questions':
                    orderedDict_questions = json.dumps(_value, ensure_ascii=False)
                    list_objects_question = json.loads(orderedDict_questions)
                    for qs in list_objects_question:
                        questions_list.append(qs['question'])
            print({'questions': qs['question'], 'answer': _value})
            print('-----------------------------------------------------------------------------')
        return Response( status=status.HTTP_200_OK, data={'response_message': "BUILDING SCENARIO SUCCESSFULY !!!!"})
    
    