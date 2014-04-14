# coding=utf-8
import os, uuid, Image, datetime
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

from smart.settings import MEDIA_ROOT
from core.renderers import *
from tw.serializers import *
from tw.renderers import *

# 生成缩略图, 缩略图默认图片宽为
def make_thumb(path, size = 500):
    pixbuf = Image.open(path)
    width, height = pixbuf.size
    if width > size:
        delta = width / size
        height = int(height / delta)
        pixbuf.thumbnail((size, height), Image.ANTIALIAS)
    return pixbuf
    
class TagsViewSet(viewsets.ModelViewSet):
    """ 
    Tag集合管理
    """
    queryset = Tag.objects.all()
    serializer_class = TagsSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        tag = data.get('tag','')
        return Tag.objects.filter(tag__icontains = tag).order_by('-hot','tag')

class TagView(APIView):
    """ 
    Tag关联管理, 四个参数:
     @ op - 操作: 
        read    - 读取与mid关联的所有tag,返回[{id:1,tag:xxx},{id:2,tag:yyy},...]
        add     - 添加mid与tid的关联关系
        remove  - 移除mid与tid的关联关系
     @ model - 指定与tag关联的model
     @ mid - model的id
     @ tid - tag的id
    
    """
    def post(self, request, format=None):
        data = request.DATA
        op = data.get('op',None)
        model = data.get('model',None)
        mid = data.get('mid',None)
        tid = data.get('tid',None)
        result = {'success': True}
        
        # 获取对应的
        m = None
        t = None
        if mid > 0:
            if model == 'a':
                m = Article.objects.get(id=mid)
            if model == 'p':
                m = Poi.objects.get(id=mid)
        if tid > 0:
            t = Tag.objects.get(id=tid)
        
        # 处理read 操作
        # 处理两个参数: model 和 mid
        if op == 'read' and m:
            tags = m.tag.all()
            result = []
            for tag in tags:
                result.append({'id':tag.id, 'tag':tag.tag})
        
        # 添加关联关系
        if op == 'add' and m and t:
            m.tag.add(t)
            t.hot = t.hot+1
            t.save()
        
        # 去除关联关系
        if op == 'remove' and m and t:
            m.tag.remove(t)
            if t.hot > 0:
                t.hot = t.hot-1
                t.save()
        
        return Response(result)

class PhotoViewSet(viewsets.ModelViewSet):
    ''' 上传图片处理
    '''
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    renderer_classes = (PhotoJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('title',)  # notice 当仅有一个字段时,后面要加上',',否则系统会将title拆解成字符串数组
    # 条件查询
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        pclass = data.get('pclass','')
        did = data.get('district',0)
        return Photo.objects.filter(pclass=pclass, district_id=did).order_by('-id')
    # 根据条件选择serializer
    # PUT修改时,仅修改title即可
    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return PhotoTitleSerializer
        return PhotoSerializer
        
    # 保存后所做处理
    def post_save(self, obj, created=False):
        method = self.request.method
        # 新上传的图片做缩略图处理
        # 修改操作仅针对 title,不会重新上传图片
        # 缩略图: 数据库存储图片源文件,同时生成三种规格缩略图: s-100px  m-500px  l-1000px
        # 缩略图文件命名规则: 源文件后加 _s _m _l
        if method == 'POST':
            photo_path = os.path.join(MEDIA_ROOT, obj.photo.name)
            base, ext = os.path.splitext(photo_path)  # split分成 目录和文件名；splitext 分成文件类型和之前的字符串
            # 1000px宽
            thumb_l = make_thumb(photo_path,1000)
            thumb_l.save(base + '_1000' + ext)
            # 500px宽
            thumb_m = make_thumb(photo_path,500)
            thumb_m.save(base + '_500' + ext)
            # 100px宽
            thumb_s = make_thumb(photo_path,100)
            thumb_s.save(base + '_100' + ext)

class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    #renderer_classes = (SmartJSONRenderer,)
    # 重载get方法，返回treestore
    def list(self, request):
        data = self.request.QUERY_PARAMS
        os = {0:{'id':0, 'name':'台湾行政区划', 'expanded':True, 'loaded':True}} # 存放上级索引 key=id value=
        ds = District.objects.all().order_by('parentId','id')
        for d in ds:
            did = d.id
            pid = d.parentId
            # 处理当前节点
            if not os.get(did,None):
                os[did] = {}
            os[did]['id'] = did
            os[did]['parentId'] = pid
            os[did]['name'] = d.name
            # 子节点伪装成已展开、加载的父节点，可以实现拖拽到叶节点上
            os[did]['leaf'] = False     # leaf = true 时，叶节点不可以被drag child
            os[did]['loaded'] = True    # 不再加载，否则会循环加载子节点
            
            # 处理父节点
            if not os.get(pid,None):
                os[pid] = {}
            if not os[pid].get('children',None):
                os[pid]['children'] = []
            os[pid]['children'].append(os[did])
            os[pid]['leaf'] = False
            os[pid]['expanded'] = True
        return Response([os[0]])

class DistrictDetailViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictDetailSerializer
    renderer_classes = (SmartJSONRenderer,)

# 文章
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    renderer_classes = (SmartJSONRenderer,)
    # 条件查询
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        pclass = data.get('pclass','')
        did = data.get('district',0)
        return Article.objects.filter(pclass=pclass, district_id=did).order_by('-id')
class ArticleDetailViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleDetailSerializer
    renderer_classes = (SmartJSONRenderer,)

# POI
class PoiViewSet(viewsets.ModelViewSet):
    queryset = Poi.objects.all()
    serializer_class = PoiSerializer
    renderer_classes = (SmartJSONRenderer,)
    # 条件查询
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        pclass = data.get('pclass','')
        did = data.get('district',0)
        return Poi.objects.filter(pclass=pclass, district_id=did).order_by('-id')
class PoiDetailViewSet(viewsets.ModelViewSet):
    queryset = Poi.objects.all()
    serializer_class = PoiDetailSerializer
    renderer_classes = (SmartJSONRenderer,)

class ArticlePoiViewSet(viewsets.ModelViewSet):
    queryset = Article_poi.objects.all()
    serializer_class = ArticlePoiSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        article = data.get('article',0)
        return Article_poi.objects.filter(article=article)
        
class Poilist(APIView):
    """
    兴趣点列表
    """
    def get(self, request, format=None):
        result = {}
        data = request.QUERY_PARAMS
        district = data.get('district',None)
        key = data.get('poi',None)
        ps = []
        #if key is not None and len(key) > 0:
        pois = Poi.objects.filter(district = district, title__icontains=key).values('id','title')
        for poi in pois:
            ps.append({'value':poi['id'], 'text':'%s'%(poi['title'])})
        result['results'] = ps
        result['count'] = len(ps)
        return Response(result)
