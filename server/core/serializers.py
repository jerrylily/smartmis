# coding=utf-8
from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import *

class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'is_superuser', 'is_staff', 'is_active', 'date_joined', 'last_login')

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page

class ModuleSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Module
        #fields = ('name', 'glyph', 'code', 'systems', 'pages')
        
class DictTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictType
        
class DictListSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictList
        
class SystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = System

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        #fields = ('id', 'name', 'code', 'domain')

class DivisionAdminSerializer(serializers.ModelSerializer):
    #user = serializers.SlugRelatedField(many=False, slug_field='username')
    username = serializers.SerializerMethodField('get_username')
    name = serializers.SerializerMethodField('get_raw_name')
    class Meta:
        model = Division_admin
        fields = ('id', 'division', 'user', 'username', 'name')
    def get_username(self, obj):
            return obj.user.username
    def get_raw_name(self, obj):
        return '%s'%(obj.user.first_name)

class UserDivisionSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_division_name')
    class Meta:
        model = Division_user
        fields = ('id', 'user', 'division', 'name')
    def get_division_name(self, obj):
        return '%s'%(obj.division.name)

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'name')

class UserRoleSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_role_name')
    class Meta:
        model = Role_user
        fields = ('id', 'user', 'role', 'name')
    def get_role_name(self, obj):
        return '%s'%(obj.role.name)
    
class OrganizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organize
        #fields = ('id', 'name')
        
class OrganizeUsersSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_user_name')
    orgname = serializers.SerializerMethodField('get_org_name')
    post = serializers.SlugRelatedField(many=False, slug_field='name', required=False)
    class Meta:
        model = Division_user
        fields = ('id', 'name', 'organize', 'orgname', 'post', 'level')
    def get_user_name(self, obj):
        return '%s(%s)'%(obj.user.first_name,obj.user.username)
    def get_org_name(self, obj):
        if obj.organize:
            return '%s'%(obj.organize.name)
        else:
            return ''