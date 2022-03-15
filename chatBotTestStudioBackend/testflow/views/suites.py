from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response

from ..serializers.suites import TestSuiteResultsSerializer, GetTestSuitesSerializer, TestSuitesSerializer
from ..models import TestSuites, TestSuiteResults

@method_decorator(name='list', decorator=swagger_auto_schema(
    operation_id="Get list test suites",
    operation_description="Get list test suites"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='update', decorator=swagger_auto_schema(
    operation_id="Update test suites",
    operation_description="Update test suites"))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(
    operation_id="Delete test suites",
    operation_description="Delete test suites"))

class TestSuitesViewSet(viewsets.ModelViewSet):
    ex_serializer_class = GetTestSuitesSerializer
    serializer_class = TestSuitesSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = TestSuites.objects.all()
        return queryset

    def list(self, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.ex_serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list test suite results",
                                                             operation_description="Get list test suite results"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))

class TestSuiteResultsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestSuiteResultsSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = TestSuiteResults.objects.all()
        return queryset