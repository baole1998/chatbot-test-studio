from django.conf.urls import url, include
from rest_framework import routers
from .views import AccountViewSet, GroupViewSet, CreateAdminUserViewSet

router = routers.DefaultRouter()
router.register(r'account', AccountViewSet, basename="account")
router.register(r'group', GroupViewSet, basename="group")
router.register(r'adminuser', CreateAdminUserViewSet, basename="adminuser")

urlpatterns = [
    url(r'',include(router.urls)),
]