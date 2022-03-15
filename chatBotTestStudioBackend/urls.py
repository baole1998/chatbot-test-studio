from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt import views as jwt_views

schema_view = get_schema_view(
    openapi.Info(
        title="CHATBOT TEST STUDIO API",
        default_version='v0.1',
        description="CHATBOT TEST STUDIO API",
        contact=openapi.Contact(email="baolq1@vps.com.vn"),
    ),
    public=True,
    # permission_classes=(permissions.IsAuthenticatedOrReadOnly,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'user/', include(("account.urls", "domain-api"), namespace="account-api")),
    url(r'testflow/', include(("testflow.urls", "testflow-api"), namespace="testflow-api")),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refreshtoken/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    
    # doc
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
