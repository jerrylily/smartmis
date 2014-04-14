# coding=utf-8
from rest_framework import serializers

from hd.models import *

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer

class CustomerPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phone
        fields = ('id', 'ptype', 'pnumber', 'pext', 'memo')

class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'atype', 'address', 'memo')

class CustomerMilescardSerializer(serializers.ModelSerializer):
    class Meta:
        model = MilesCard
        fields = ('id', 'mtype', 'cardno', 'memo')

class CustomerInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ('id', 'title', 'memo')

class CustomerPassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = ('id', 'name', 'gender', 'ptype', 'number', 'country', 'birthday', 'valid', 'milecards', 'phone', 'email', 'memo')

