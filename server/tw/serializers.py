# coding=utf-8
import os
from rest_framework import serializers

from tw.models import *

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ('id', 'name', 'parentId')
        
class DistrictDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ('id', 'latlng', 'content')
    
class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'tag', 'hot')
        
class PhotoSerializer(serializers.ModelSerializer):
    photo_1000 = serializers.SerializerMethodField('get_photo_1000')
    photo_500 = serializers.SerializerMethodField('get_photo_500')
    photo_100 = serializers.SerializerMethodField('get_photo_100')
    class Meta:
        model = Photo
        fields = ('id', 'title', 'pclass', 'district', 'photo', 'photo_1000', 'photo_500', 'photo_100')
    
    def get_photo_1000(self, obj):
        base, ext = os.path.splitext(obj.photo.name)
        return base + '_1000' + ext
    def get_photo_500(self, obj):
        base, ext = os.path.splitext(obj.photo.name)
        return base + '_500' + ext
    def get_photo_100(self, obj):
        base, ext = os.path.splitext(obj.photo.name)
        return base + '_100' + ext
# 仅仅用来修改title
class PhotoTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('id', 'title')

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'district', 'title', 'pclass', 'weight', 'status')
        
class ArticleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'title', 'copyurl', 'content', 'contentBak')

class PoiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poi
        fields = ('id', 'district', 'title', 'pclass', 'weight', 'status')
        
class PoiDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poi
        fields = ('id', 'title', 'latlng', 'content', 'contentBak')

class ArticlePoiSerializer(serializers.ModelSerializer):
    poiname = serializers.SerializerMethodField('get_name')
    class Meta:
        model = Article_poi
        fields = ('id', 'article', 'poi', 'poiname')
    def get_name(self, obj):
            return obj.poi.title
