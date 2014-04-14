 # encoding: utf-8

import os, uuid, Image, datetime
from django.db import models

class District(models.Model):
    """ 行政区划
        - 第1检索维度
        - 按照行政区划检索对应的POI(兴趣点)和文章
    """
    name        = models.CharField(max_length=128)                                          # 名称
    parentId    = models.IntegerField(default=0)                                            # 父id
    latlng      = models.CharField(max_length=128, blank=True, null=True)                   # 纬度,经度
    content     = models.TextField(blank=True, null=True)                                   # 介绍内容
    weight      = models.IntegerField(default=0)                                            # 权重
    
    ###
    # 第2检索维度 - 类别
    # POI 的类别: 景点JD 住宿ZS 餐饮CY 购物GW 娱乐YL 教育JY 交通JT
    # 文章 的类别: 攻略GL 行程XC 贴士TS
    ###
    
class Tag(models.Model):
    """ 标签
        - 第3检索维度
        - 根据标签检索汇聚兴趣点和文章
    """
    tag         = models.CharField(max_length=32, unique=True)                              # 标签,必填项
    hot         = models.IntegerField(default=0)                                            # hot程度,整数
    
class Photo(models.Model):
    """ 照片
        照片分类:集合了POI和文章的类别
        分类: 区划QH 景点JD 住宿酒店ZSJD 住宿民宿ZSMS 餐饮CY 购物GW 娱乐YL 学校XX 交通JT 商圈SQ 美食MS 特产TC 人物RW 教育JY 风俗FS 活动HD 攻略GL 行程XC 贴士TS
    """
    # 生成的文件名称
    def generate_new_filename(instance, filename):
        f, ext = os.path.splitext(filename)
        filename = '%s%s' % (uuid.uuid4().hex, ext)     # ext中含有.
        now = datetime.datetime.now()
        return os.path.join('photo/%s'%(now.strftime('%Y%m%d')), filename)
    
    district    = models.ForeignKey(District, blank=True, null=True, on_delete=models.SET_NULL)
    title       = models.CharField(max_length=128)                                          # 照片标题
    pclass      = models.CharField(max_length=4)                                            # 类别
    photo       = models.ImageField(upload_to=generate_new_filename)                        # 照片存储位置
    
class Poi(models.Model):
    """ 兴趣点 Point of Interest
        包含地理坐标的具体点，可以从行政区划、类别、tag 三个维度检索和汇聚
        分类: 景点JD 住宿酒店ZSJD 住宿民宿ZSMS 餐饮CY 购物GW 娱乐YL 学校XX 交通JT
    """
    
    district    = models.ForeignKey(District, blank=True, null=True, on_delete=models.SET_NULL)
    title       = models.CharField(max_length=128)                                          # 名称
    pclass      = models.CharField(max_length=4, blank=True)                                # 类别
    latlng      = models.CharField(max_length=128, blank=True, null=True)                   # 纬度,经度
    content     = models.TextField(blank=True, null=True)                                   # 介绍内容
    weight      = models.IntegerField(default=0)                                            # 权重
    tag         = models.ManyToManyField(Tag)                                               # 标签
    
class Article(models.Model):
    """ 文章
        介绍类内容,自由行文
        分类:商圈SQ 美食MS 特产TC 人物RW 教育JY 风俗FS 活动HD 攻略GL 行程XC 贴士TS 
    """
    district    = models.ForeignKey(District, blank=True, null=True, on_delete=models.SET_NULL)
    title       = models.CharField(max_length=128)                                          # 文章标题
    pclass      = models.CharField(max_length=4, blank=True)                                # 类别
    copyurl     = models.URLField(blank=True, null=True)                                    # 出处文章地址
    content     = models.TextField(blank=True, null=True)                                   # 文章内容
    weight      = models.IntegerField(default=0)                                            # 权重
    tag         = models.ManyToManyField(Tag)                                               # 标签
    poi         = models.ManyToManyField(Poi, through='Article_poi')                        # 所包含的兴趣点
    
class Article_poi(models.Model):
    """ 文章与兴趣点的对应关系表
    """
    article     = models.ForeignKey(Article)
    poi         = models.ForeignKey(Poi)
    
    
