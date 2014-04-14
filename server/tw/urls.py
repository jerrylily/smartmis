# coding=utf-8
from django.conf.urls import patterns, url, include
from rest_framework import routers
from tw import views

router = routers.DefaultRouter()
# url前缀 tw/
router.register(r'district', views.DistrictViewSet)
router.register(r'district_detail', views.DistrictDetailViewSet)
router.register(r'photo', views.PhotoViewSet)
router.register(r'tags', views.TagsViewSet)
router.register(r'article', views.ArticleViewSet)
router.register(r'article_detail', views.ArticleDetailViewSet)
router.register(r'poi', views.PoiViewSet)
router.register(r'poi_detail', views.PoiDetailViewSet)
router.register(r'article_poi', views.ArticlePoiViewSet)

urlpatterns = patterns('',
    url(r'^tag/', views.TagView.as_view()),
    url(r'^poilist/', views.Poilist.as_view()),
    url(r'^', include(router.urls))
)