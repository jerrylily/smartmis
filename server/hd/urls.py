# coding=utf-8
from django.conf.urls import patterns, url, include
from rest_framework import routers
from hd import views

router = routers.DefaultRouter()
# url前缀 hd/
router.register(r'customer', views.CustomerViewSet)
router.register(r'customer_phone', views.CustomerPhoneViewSet)
router.register(r'customer_address', views.CustomerAddressViewSet)
router.register(r'customer_milescard', views.CustomerMilescardViewSet)
router.register(r'customer_invoice', views.CustomerInvoiceViewSet)
router.register(r'customer_passenger', views.CustomerPassengerViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls))
)