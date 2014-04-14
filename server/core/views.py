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

from core.serializers import *
from core.renderers import *

def s_index(request):
    """
    check if login, no -> login panel : yes -> main panel
    """
    c = {}
    c.update(csrf(request))
    if request.user.is_authenticated():
        return render_to_response('index.html', {'user': request.user})
    else:
        return render_to_response('login.html', c)

class Ver(APIView):
    """ 
    get new update ver & siz
    @return {ver: , size: }
    """
    permission_classes = (permissions.AllowAny,)    # any one can access
    def get(self, request, format=None):
        ver = {
            'ver':  '2.0.2',
            'size': 4552585,
            'md5': 'e114c614e05a70d76df585854db0acc4'
        }
        return Response(ver)

class Login(APIView):
    """
    login check
    @return json  {status:0}
    @status:    1 - name invalid
                2 - password invalid
                3 - name & passwd valid , but deny access
                4 - all ok
    """
    permission_classes = (permissions.AllowAny,)
    def get(self, request, format=None):
        result = {'status':0}
        data = request.QUERY_PARAMS
        sname = data.get('sm_user','')
        spswd = data.get('sm_pswd','')
        try:
            usr = User.objects.get(username = sname)
            user = authenticate(username=sname, password=spswd)
            if user is not None:
                if user.is_active:
                    login(request, user)    # use django.contrib.auth.login , set session
                    result['status'] = 4
                else:
                    result['status'] = 3
            else:
                result['status'] = 2
        except:
            result['status'] = 1
            
        return Response(result)

class NavList(APIView):
    """
        获取用户权限
    """
    def get(self, request, format=None):
        user = request.user
        uid = user.id
        is_super = user.is_superuser
        mos = Module.objects.all()
        if is_super:
            mos = mos.filter(Q(pk = 1) | Q(system__pk = 1))
        else:
            mos = mos.filter(Q(system__pk = 1))
        ms = {}
        for mo in mos:
            ms[mo.id] = {'name': mo.name, 'glyph': mo.glyph, 'code': mo.code, 'pages': []}
        
        pages = Page.objects.all().values('name','icon','glyph','code','is_top','module_id')
        for pg in pages:
            mid = pg.get('module_id', 0)
            m = ms.get(mid, None)
            if m:
                p = {}
                p['name'] = pg['name']
                p['glyph'] = pg['glyph']
                p['icon'] = pg['icon']
                p['code'] = '%s.%s'%(m['code'], pg['code'].capitalize())
                p['is_top'] = pg['is_top']
                m['pages'].append(p)
        return Response(ms.values())

@login_required     # limit login access decorator
def s_logout(request):
    """
    logout , clear session, redirect to login panel
    """
    logout(request)     # use django.contrib.auth.logout , clear all session , redirect to logout
    return redirect('/')
    

class Dictcombo(APIView):
    """
    字典类下拉列表
    """
    def get(self, request, format=None):
        result = {}
        data = request.QUERY_PARAMS
        dtype = data.get('dtype',None)
        ds = []
        if dtype is not None and len(dtype) > 0:
            dicts = DictList.objects.filter(dicttype__name__exact=dtype).values('key','value').order_by('order')
            for d in dicts:
                ds.append({'value':d['key'], 'text':d['value']})
        result['results'] = ds
        result['count'] = len(ds)
        return Response(result)
    
class Userlist(APIView):
    """
    用户列表
    """
    def get(self, request, format=None):
        result = {}
        data = request.QUERY_PARAMS
        sname = data.get('user',None)
        us = []
        if sname is not None and len(sname) > 0:
            users = User.objects.filter(username__icontains=sname).values('id','username','first_name')
            for u in users:
                us.append({'value':u['id'], 'text':'%s[%s]'%(u['username'],u['first_name'])})
                #us.append({'value':u['id'], 'text':'%s'%(u['username'])})
        result['results'] = us
        result['count'] = len(us)
        return Response(result)

class Divisionlist(APIView):
    """
    单位列表, 一次全部显示
    """
    def get(self, request, format=None):
        user = request.user
        uid = user.id
        ds = None
        result = {}
        if user.is_superuser:
            ds = Division.objects.all().values('id','name')
        else:
            ds_list = Division_admin.objects.filter(user=uid).values_list('division', flat=True)
            ds = Division.objects.filter(pk__in = list(ds_list)).values('id','name')
        us = []
        for d in ds:
            us.append({'value':d['id'], 'text':d['name']})
        result['results'] = us
        result['count'] = len(us)
        return Response(result)

class Rolelist(APIView):
    """
    角色列表, 一次全部显示
    """
    def get(self, request, format=None):
        data = self.request.QUERY_PARAMS
        division = data.get('division',None)
        user = request.user
        uid = user.id
        ds = None
        result = {}
        ds = Role.objects.filter(division = division).values('id','name')
        us = []
        for d in ds:
            us.append({'value':d['id'], 'text':d['name']})
        result['results'] = us
        result['count'] = len(us)
        return Response(result)
    
class PageGrid(APIView):
    """
    功能页列表，用于check grid
    """
    def get(self, request, format=None):
        result = {}
        sys = System.objects.all()[:1].get()
        mos = sys.module.all().order_by('id')
        ps = []
        for mo in mos:
            pages = mo.page_set.all().order_by('id')
            for pg in pages:
                p = {}
                p['id'] = pg.id
                p['page'] = pg.name
                p['code'] = pg.code
                p['module'] = '[%02d]%s'%(mo.id,mo.name)
                #p['order'] = '%02d%03d'%(mo.id,pg.id)
                ps.append(p)
        result['results'] = ps
        result['count'] = len(ps)
        return Response(result)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('username', 'first_name', 'last_name', 'email')
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        division = data.get('division',None)
        if division:
            ids = Division_user.objects.filter(division = division).values('user')
            return User.objects.filter(pk__in = ids).order_by('-is_active','id')
        else:
            return User.objects.all().order_by('-is_active','id')
    # pre_save 对 create 和 update 起作用
    # 保存前所做处理
    def pre_save(self, obj):
        user = self.request.user
        # 处理用户自己的记录时，不允许修改自己的状态
        if obj.id == user.id:
            obj.is_active = True   # 忽略is_active参数
            
        # 如果提交上来的数据中 psw 不为空,或者是新添加用户，则重置密码为 666666
        psw = self.request.DATA.pop('psw','')
        if psw == '666666' or self.request.method == 'POST':
            obj.set_password('666666')
            
    # 保存后所做处理
    def post_save(self, obj, created=False):
        method = self.request.method
        division = self.request.QUERY_PARAMS.get('division',None)
        # 2.如果是在下属单位内进行用户添加,还必须将用户加入该组织
        if division and created and method == 'POST':
            d = None
            try:
                d = Division.objects.get(pk = division)
            finally:
                pass
            if d:
                obj.division_user_set.create(division = d)
        
    def destroy(self, request, pk=None):
        user = request.user
        obj = self.get_object()
        if obj.id != user.id:
            obj.is_active = False
            obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class DictTypeViewSet(viewsets.ModelViewSet):
    queryset = DictType.objects.all()
    serializer_class = DictTypeSerializer
    renderer_classes = (SmartJSONRenderer,)
    
class DictListViewSet(viewsets.ModelViewSet):
    queryset = DictList.objects.all()
    serializer_class = DictListSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        dtype = data.get('dicttype',0)
        return DictList.objects.filter(dicttype=dtype)
        
class SystemViewSet(viewsets.ModelViewSet):
    queryset = System.objects.all()
    serializer_class = SystemSerializer
    renderer_classes = (SmartJSONRenderer,)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    renderer_classes = (SmartJSONRenderer,)

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    renderer_classes = (SmartJSONRenderer,)
    #filter_fields = ('module',) # filter ?module = 2 
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        module = data.get('module',0)
        return Page.objects.filter(module=module)

class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    renderer_classes = (SmartJSONRenderer,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name', 'code', 'domain')

class DivisionAdminViewSet(viewsets.ModelViewSet):
    queryset = Division_admin.objects.all()
    serializer_class = DivisionAdminSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        division = data.get('division',0)
        return Division_admin.objects.filter(division=division)

class UserDivisionViewSet(viewsets.ModelViewSet):
    queryset = Division_user.objects.all()
    serializer_class = UserDivisionSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        user = data.get('user','')
        return Division_user.objects.filter(user=user)

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        division = data.get('division',0)
        return Role.objects.filter(division=division)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        division = data.get('division',0)
        return Post.objects.filter(division=division)
    # 保存前所做处理
    def pre_save(self, obj):
        data = self.request.QUERY_PARAMS
        division = data.get('division',0)
        obj.division_id = division

class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = Role_user.objects.all()
    serializer_class = UserRoleSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        user = data.get('user','')
        division = data.get('division',0)
        return Role_user.objects.filter(user=user,role__division=division)

class OrganizeViewSet(viewsets.ModelViewSet):
    queryset = Organize.objects.all()
    serializer_class = OrganizeSerializer
    #renderer_classes = (SmartJSONRenderer,)
    # 重载get方法，返回treestore
    def list(self, request):
        data = self.request.QUERY_PARAMS
        division = data.get('division',0)
        if division == 0:
            return Response([])
        dname = data.get('dname','')
        os = {0:{'id':0, 'name':dname, 'expanded':True}} # 存放上级索引 key=id value=
        orgs = Organize.objects.filter(division = division,is_active=True).order_by('parentId','id')
        for o in orgs:
            oid = o.id
            pid = o.parentId
            # 处理当前节点
            if not os.get(oid,None):
                os[oid] = {}
            os[oid]['id'] = oid
            os[oid]['parentId'] = pid
            os[oid]['division'] = o.division_id
            os[oid]['name'] = o.name
            os[oid]['address'] = o.address
            os[oid]['phone'] = o.phone
            # 子节点伪装成已展开、加载的父节点，可以实现拖拽到叶节点上
            os[oid]['leaf'] = False     # leaf = true 时，叶节点不可以被drag child
            os[oid]['loaded'] = True    # 不再加载，否则会循环加载子节点
            
            # 处理父节点
            if not os.get(pid,None):
                os[pid] = {}
            if not os[pid].get('children',None):
                os[pid]['children'] = []
            os[pid]['children'].append(os[oid])
            os[pid]['leaf'] = False
            os[pid]['expanded'] = True
        return Response([os[0]])
    #def destroy(self, request, pk=None):
    #    obj = self.get_object()
    #    obj.is_active = False
    #    obj.save()
    #    return Response(status=status.HTTP_204_NO_CONTENT)

class OrganizeUsersViewSet(viewsets.ModelViewSet):
    queryset = Division_user.objects.all()
    serializer_class = OrganizeUsersSerializer
    renderer_classes = (SmartJSONRenderer,)
    def get_queryset(self):
        data = self.request.QUERY_PARAMS
        org = data.get('org','0')
        orgs = []
        if org != '0' and org != 'u':
            orgs = org.split(',')
        division = data.get('division','0')
        userset = Division_user.objects.filter(division=division)
        if org == 'u':
            userset = userset.filter(organize = None)
        if len(orgs) > 0:
            userset = userset.filter(organize__in = orgs)
        return userset
