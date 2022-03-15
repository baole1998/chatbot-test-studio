from django.conf.urls import url, include
from django.urls import path
from rest_framework import routers
from testflow.views.system_roles import SystemRolesViewSet
from testflow.views.chat_systems import ChatSystemsViewSet
from testflow.views.suites import TestSuiteResultsViewSet, TestSuitesViewSet
from testflow.views.test_cases import TestCasesViewSet, CaseResultsViewSet, ControlTesting
from testflow.views.test_items import TestItemsViewSet, TestQuestionsViewSet, ItemResultsViewSet

router = routers.DefaultRouter()
router.register(r'system-roles', SystemRolesViewSet, basename="system-roles")
router.register(r'chat-system', ChatSystemsViewSet, basename="chat-system")
router.register(r'suites', TestSuitesViewSet, basename="suites")
router.register(r'suite-results', TestSuiteResultsViewSet, basename="suite-results")
router.register(r'test-cases', TestCasesViewSet, basename="test-cases")
router.register(r'cases-results', CaseResultsViewSet, basename="cases-results")
router.register(r'test-items', TestItemsViewSet, basename="test-items")
router.register(r'test-questions', TestQuestionsViewSet, basename="test-questions")
router.register(r'item-results', ItemResultsViewSet, basename="item-results")
router.register(r'start-testing', ControlTesting, basename="start-testing")

urlpatterns = [
    url(r'^', include(router.urls)),
]