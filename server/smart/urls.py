# coding=utf-8
from django.conf.urls import patterns, url, include
from rest_framework import routers

urlpatterns = patterns('',
    url(r'^api_auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^', include('core.urls')),        # 核心模块
    url(r'^hd/', include('hd.urls')),       # HD模块
    url(r'^npi/', include('npi.urls')),     # NPI模块
    url(r'^tw/', include('tw.urls')),       # TW模块
)