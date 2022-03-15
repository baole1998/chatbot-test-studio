from django.db import models
from account.models import Account

class ChatSystems(models.Model):
    code = models.AutoField(primary_key=True)
    name = models.CharField(verbose_name='Chat System Name', max_length=255, null=True, blank=True, editable=True)
    type = models.CharField(verbose_name='Chat System Type', max_length=255, null=True, blank=True, editable=True)
    endpoint_URL = models.CharField(verbose_name='Chat System Endpoint URL', max_length=255, null=True, blank=True, editable=True)
    extra_params = models.CharField(verbose_name='Extra Params', max_length=255, null=True, blank=True, editable=True)
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)
    
    class Meta:
        ordering = ['code']
        db_table = 'chat_systems'

class TestSuites(models.Model):
    code = models.AutoField(primary_key=True)
    systems_code = models.ForeignKey(ChatSystems, verbose_name='Systems Code', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    description = models.CharField(verbose_name='Description', max_length=255, null=True, blank=True, editable=True)
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)

    class Meta:
        ordering = ['code']
        db_table = 'test_suites'


class TestSuiteResults(models.Model):
    systems_code = models.ForeignKey(TestSuites, verbose_name='Test Suite Code', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    execution_time = models.DateTimeField(verbose_name='Execution Time', null=True, blank=True, editable=True)
    status = models.IntegerField(
        verbose_name='Status', null=True, blank=True, editable=True, 
        choices=[(1, 'Passed'), (2, 'Failed')]
    )
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)

    class Meta:
        ordering = ['id']
        db_table = 'test_suite_results'

class SystemRoles(models.Model):
    system_code = models.CharField(verbose_name='System Code', max_length=255, null=True, blank=True, editable=True)
    username = models.ForeignKey(Account, verbose_name='Username', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['id']
        db_table = 'system_roles'

class TestCases(models.Model):
    code = models.AutoField(primary_key=True)
    suite_code = models.ForeignKey(TestSuites, verbose_name='Test Suite Code', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    description = models.CharField(verbose_name='Description', max_length=255, null=True, blank=True, editable=True)
    isFlow = models.BooleanField(verbose_name='Is Flow', null=True, blank=True, editable=True)
    status = models.IntegerField(   
        verbose_name='Status', null=True, blank=True, editable=True, 
        choices=[(1, 'Create'), (2, 'Testing'), (3, 'Done')])
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)

    class Meta:
        ordering = ['code']
        db_table = 'test_cases'


class CaseResults(models.Model):
    case_code = models.ForeignKey(TestCases, verbose_name='Test Case Code', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    suite_result_id = models.ForeignKey(TestSuiteResults, verbose_name='Test Case Code', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    execution_time = models.DateTimeField(verbose_name='Execution Time', null=True, blank=True, editable=True)
    status = models.IntegerField(
        verbose_name='Status', null=True, blank=True, editable=True, 
        choices=[(1, 'Passed'), (2, 'Failed')]
    )
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)
    
    class Meta:
        ordering = ['id']
        db_table = 'case_results'

class TestItems(models.Model):
    case_code = models.ForeignKey(TestCases, related_name='test_items', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    answer = models.TextField(verbose_name='Answer', null=True, blank=True, editable=True)
    assertion_operator = models.BooleanField(verbose_name='Assertion Operator', null=True, blank=True, editable=True)
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)

    class Meta:
        ordering = ['id']
        db_table = 'test_items'


class TestQuestions(models.Model):
    item_id = models.ForeignKey(TestItems, related_name='questions', verbose_name='Item ID', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    question = models.TextField(verbose_name='Question', null=True, blank=True, editable=True)
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)

    class Meta:
        ordering = ['id']
        db_table = 'test_questions'


class ItemResults(models.Model):
    case_results_id = models.ForeignKey(CaseResults, verbose_name='Case Result ID', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    item_id = models.ForeignKey(TestItems, verbose_name='Item ID', blank=True, editable=True, on_delete=models.SET_NULL, null=True)
    execution_time = models.DateTimeField(verbose_name='Execution Time', null=True, blank=True, editable=True)
    execution_end = models.DateTimeField(verbose_name='Execution End', null=True, blank=True, editable=True)
    assertion_error = models.TextField(verbose_name='Assertion Error', null=True, blank=True, editable=True)
    status = models.IntegerField(
        verbose_name='Status', null=True, blank=True, editable=True, 
        choices=[(1, 'Passed'), (2, 'Failed')]
    )
    create_time = models.DateTimeField(verbose_name='Create Time', null=True, blank=True, editable=True)
    update_time = models.DateTimeField(verbose_name='Update Time', null=True, blank=True, editable=True)
    
    class Meta:
        ordering = ['id']
        db_table = 'test_results'