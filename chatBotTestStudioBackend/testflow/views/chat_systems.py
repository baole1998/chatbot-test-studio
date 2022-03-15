import os
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response

from ..serializers.chat_systems import ChatSystemsSerializer
from ..models import ChatSystems

@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list chat system",
                                                             operation_description="Get list chat system"))
@method_decorator(name='create', decorator=swagger_auto_schema(operation_id="Create list chat system",
                                                               operation_description="Create list chat system"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(auto_schema=None))

class ChatSystemsViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSystemsSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = ChatSystems.objects.all()
        return queryset