# coding=utf-8

import os
import Image
from smart.settings import MEDIA_ROOT
from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields.files import ImageFieldFile

def make_thumb(path, size = 128):
    pixbuf = Image.open(path)
    width, height = pixbuf.size
    if width > size:
        delta = width / size
        height = int(height / delta)
        pixbuf.thumbnail((size, height), Image.ANTIALIAS)
        return pixbuf
        
class Avatar(models.Model):
    user        = models.ForeignKey(User)
    photo       = models.ImageField(upload_to='photos')
    thumb_l     = models.ImageField(upload_to='photos/thumb', blank=True)   # 128px
    thumb_m     = models.ImageField(upload_to='photos/thumb', blank=True)   # 64px
    thumb_s     = models.ImageField(upload_to='photos/thumb', blank=True)   # 32px
    date        = models.DateTimeField(auto_now = True)
    def save(self):
        super(Avatar, self).save() # 将上传的图片先保存一下，否则报错
        base, ext = os.path.splitext(os.path.basename(self.photo.path))
        
        thumb_l_pixbuf = make_thumb(os.path.join(MEDIA_ROOT, self.photo.name),128)
        thumb_m_pixbuf = make_thumb(os.path.join(MEDIA_ROOT, self.photo.name),64)
        thumb_l_pixbuf = make_thumb(os.path.join(MEDIA_ROOT, self.photo.name),32)
        
        relate_thumb_path = os.path.join(THUMB_ROOT, base + '.thumb' + ext)
        relate_thumb_path = os.path.join(THUMB_ROOT, base + '.thumb' + ext)
        relate_thumb_path = os.path.join(THUMB_ROOT, base + '.thumb' + ext)
        thumb_path = os.path.join(MEDIA_ROOT, relate_thumb_path)
        thumb_pixbuf.save(thumb_path)
        self.thumb_l = ImageFieldFile(self, self.thumb_l, relate_thumb_l_path)
        super(Avatar, self).save()  # 再保存一下，包括缩略图等

    def __unicode__(self):
        return self.title

class Module(models.Model):
    """
    功能模块 : config / person / ...
    """
    name        = models.CharField(max_length=100)
    glyph       = models.CharField(max_length=50)
    code        = models.CharField(max_length=50)
    
    def __unicode__(self):
        return '%s' % (self.name)

class Page(models.Model):
    """
    功能页 : config.setting / person.info / ...
    """
    name        = models.CharField(max_length=100)
    icon        = models.CharField(max_length=50)
    glyph       = models.CharField(max_length=50)
    code        = models.CharField(max_length=50)
    is_top      = models.BooleanField()
    module      = models.ForeignKey(Module)
    
    def __unicode__(self):
        return '%s' % (self.name)

class System(models.Model):
    """
    系统授权 : NPI / HD / ...
    """
    name        = models.CharField(max_length=100) # 授权单位名称
    code        = models.CharField(max_length=50)  # 授权码
    num         = models.IntegerField(default=0)    # 授权人数
    limit       = models.DateField(blank=True, null=True) # 授权期限
    contact     = models.CharField(max_length=100, blank=True) # 授权单位联系人姓名
    phone       = models.CharField(max_length=100, blank=True) # 授权单位联系电话
    address     = models.CharField(max_length=200, blank=True) # 授权单位联系地址
    zipcode     = models.CharField(max_length=30, blank=True) # 授权单位邮编
    module      = models.ManyToManyField(Module)
    
    def __unicode__(self):
        return '%s' % (self.name)

class Division(models.Model):
    """
    所辖单位 : 相对独立的分部组织，有独立的行政、财务体系
    @ 用户名将以域名邮箱区分
    @ 单位管理员由超管指定
    """
    name        = models.CharField(max_length=100) # 分部名称
    code        = models.CharField(max_length=50)  # 分部代码
    domain      = models.CharField(max_length=100, blank=True) # 分部域名
    admin       = models.ManyToManyField(User, through='Division_admin', related_name='admin+')    # 分部指定管理员
    user        = models.ManyToManyField(User, through='Division_user', related_name='user+')    # 分部所属员工
    
    def __unicode__(self):
        return '%s' % (self.name)

class Organize(models.Model):
    """
    单位所辖部门
    @ 部门不能删除，只能设置为不活跃，其他数据会与之关联
    """
    name        = models.CharField(max_length=100)
    division    = models.ForeignKey(Division)
    parentId    = models.IntegerField(default=0) # 父id
    address     = models.CharField(max_length=500, blank=True)
    phone       = models.CharField(max_length=200, blank=True)
    is_active   = models.BooleanField(default=True)
    
    def __unicode__(self):
        return '%s' % (self.name)

class Role(models.Model):
    """
    系统角色
    @不同的分部设置不同的角色 
    """
    name        = models.CharField(max_length=100)
    division    = models.ForeignKey(Division)
    page        = models.ManyToManyField(Page)
    user        = models.ManyToManyField(User, through='Role_user')
    
    def __unicode__(self):
        return '%s' % (self.name)

class Post(models.Model):
    """
    用户职位
    @ 不同单位设置不同职位
    @ 可以通过combobox进行管理
    """
    name        = models.CharField(max_length=100)
    division    = models.ForeignKey(Division)

class Role_user(models.Model):
    """
    员工与角色对应关系表
    """
    role        = models.ForeignKey(Role)
    user        = models.ForeignKey(User)

class Division_user(models.Model):
    """
    单位所属员工,以及所属部门
    """
    user        = models.ForeignKey(User)
    division    = models.ForeignKey(Division)
    organize    = models.ForeignKey(Organize, blank=True, null=True, on_delete=models.SET_NULL)
    post        = models.ForeignKey(Post, blank=True, null=True, on_delete=models.SET_NULL)
    level       = models.IntegerField(default=0) # 涉密等级 0-看不到任何共享文件 , 1 - n 等级越高

class Division_admin(models.Model):
    """
    所辖单位管理员
    """
    user        = models.ForeignKey(User)
    division    = models.ForeignKey(Division)

class DictType(models.Model):
    """ 字典类别模型定义
        - 定义字典数据所对应的类别数据
        - 与DictList中的type_id对应
    """
    name        = models.CharField(max_length=32)                               # 类别标识
    memo        = models.CharField(max_length=128)                              # 备注说明键值定义的规则
      
class DictList(models.Model):
    """ 字典模型定义
        - 定义各类使用到的键值对应数据
        - 为UI中的下拉列表(ComboBox)提供数据加载
    """
    dicttype    = models.ForeignKey(DictType)
    key         = models.CharField(max_length=64)                               # 键
    value       = models.CharField(max_length=64)                               # 值
    order       = models.IntegerField(default=0)                                # 排序 降序
