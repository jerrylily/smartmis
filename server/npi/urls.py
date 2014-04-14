# coding=utf-8
from django.conf.urls import patterns, url, include
from rest_framework import routers
from npi import views

router = routers.DefaultRouter()
urlpatterns = patterns('',
    url(r'^', include(router.urls))
)