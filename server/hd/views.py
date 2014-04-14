# coding=utf-8
from django.contrib.auth.models import User, Group
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q

from django.shortcuts import render_to_response, redirect
from django.views.generic.base import RedirectView

from django.views.decorators.csrf import csrf_exempt
from django.core.context_processors import csrf

from rest_framework import permissions, renderers, viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from core.renderers import *
from hd.serializers import *

class CustomerViewSet(viewsets.ModelViewSet):
    """
    客户
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name', 'ctype', 'cproperty', 'company', 'email', 'memo')
    def pre_save(self, obj):
        user = self.request.user
        if self.request.method == 'POST':
            obj.creator = user.last_name   # 设置创建人为本人

class CustomerPhoneViewSet(viewsets.ModelViewSet):
    """
    客户关联电话
    """
    queryset = Phone.objects.all()
    serializer_class = CustomerPhoneSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('pnumber', 'memo')
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        return Phone.objects.filter(customer=cust)
    def pre_save(self, obj):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        if cust > 0 and self.request.method == 'POST':
            obj.customer_id = cust

class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    客户关联地址
    """
    queryset = Address.objects.all()
    serializer_class = CustomerAddressSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('address', 'memo')
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        return Address.objects.filter(customer=cust)
    def pre_save(self, obj):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        if cust > 0 and self.request.method == 'POST':
            obj.customer_id = cust

class CustomerMilescardViewSet(viewsets.ModelViewSet):
    """
    客户关联里程卡
    """
    queryset = MilesCard.objects.all()
    serializer_class = CustomerMilescardSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('cardno', 'memo')
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        return MilesCard.objects.filter(customer=cust)
    def pre_save(self, obj):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        if cust > 0 and self.request.method == 'POST':
            obj.customer_id = cust

class CustomerInvoiceViewSet(viewsets.ModelViewSet):
    """
    客户关联发票抬头
    """
    queryset = Invoice.objects.all()
    serializer_class = CustomerInvoiceSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('title', 'memo')
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        return Invoice.objects.filter(customer=cust)
    def pre_save(self, obj):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        if cust > 0 and self.request.method == 'POST':
            obj.customer_id = cust

class CustomerPassengerViewSet(viewsets.ModelViewSet):
    """
    客户关联乘机人
    """
    queryset = Passenger.objects.all()
    serializer_class = CustomerPassengerSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name', 'number', 'milecards', 'phone', 'email', 'memo')
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        return Passenger.objects.filter(customer=cust)
    def pre_save(self, obj):
        data = self.request.QUERY_PARAMS
        cust = data.get('customer',0)
        if cust > 0 and self.request.method == 'POST':
            obj.customer_id = cust
        
        