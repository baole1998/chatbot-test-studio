from django.db.models import query_utils
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.pagination import LimitOffsetPagination
from django.http import JsonResponse
from rest_framework.response import Response

from rest_framework import status

from account.serializers import AccountSerializers, GroupSerializers, CreateAdminUserSerializers
from account.models import Account
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password

@method_decorator(name='list', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='create', decorator=swagger_auto_schema(operation_id="Register",
                                                               operation_description="Register"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(auto_schema=None))

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializers
    pagination_class = LimitOffsetPagination
    permission_classes = (permissions.IsAdminUser,)
    def create (self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print('serializer', serializer)
        if serializer.is_valid(raise_exception=True):
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            user = serializer.save()
            return JsonResponse({
                'message': 'Register successful!'
            }, status=status.HTTP_201_CREATED)

        else:
            return JsonResponse({
                'error_message': 'This username has already existed!',
                 'errors_code': 400,
            }, status=status.HTTP_400_BAD_REQUEST)
    def get_queryset(self):
        queryset = Account.objects.all()
        return queryset
        
@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="Get list of groups",
                                                             operation_description="Get list of groups"))
@method_decorator(name='create', decorator=swagger_auto_schema(operation_id="Create a group",
                                                               operation_description="Create a group"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(operation_id="Read a group",
                                                                 operation_description="Read a group"))
@method_decorator(name='update', decorator=swagger_auto_schema(operation_id="Modify a group",
                                                               operation_description="Modify a group"))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(operation_id="partial update a group",
                                                               operation_description="partial update a group"))
@method_decorator(name='destroy', decorator=swagger_auto_schema(operation_id="Delete a group",
                                                                operation_description="Delete a group"))
class GroupViewSet(viewsets.ModelViewSet):

    serializer_class = GroupSerializers
    pagination_class = LimitOffsetPagination
    permission_classes = (permissions.IsAdminUser,)
    http_method_names = ['get', 'head', 'put', 'patch', 'post']
    def get_queryset(self, *args, **kwargs):
        queryset = Group.objects.all()
        return queryset

@method_decorator(name='list', decorator=swagger_auto_schema(operation_id="For Admin: Get list of users",
                                                             operation_description="For Admin: Get list of users"))
@method_decorator(name='create', decorator=swagger_auto_schema(operation_id="For Admin: Create a user",
                                                               operation_description="For Admin: Create a user"))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(operation_id="For Admin: Read a user",
                                                                 operation_description="For Admin: Read a user"))
@method_decorator(name='update', decorator=swagger_auto_schema(operation_id="For Admin: Modify a user",
                                                               operation_description="For Admin: Modify a user"))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(auto_schema=None))
@method_decorator(name='destroy', decorator=swagger_auto_schema(operation_id="For Admin: Delete a user",
                                                                operation_description="For Admin: Delete a user"))

class CreateAdminUserViewSet(viewsets.ModelViewSet):
    serializer_class = CreateAdminUserSerializers
    pagination_class = LimitOffsetPagination
    permission_classes = (permissions.IsAdminUser,)
    def create (self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            user = serializer.save()
            return JsonResponse({
                'message': 'Register successful!'
            }, status=status.HTTP_201_CREATED)

        else:
            return JsonResponse({
                'error_message': 'This username has already existed!',
                 'errors_code': 400,
            }, status=status.HTTP_400_BAD_REQUEST)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()
    
    def get_queryset(self):
        return