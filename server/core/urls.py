# coding=utf-8
from django.conf.urls import patterns, url, include
from rest_framework import routers
from core import views

router = routers.DefaultRouter()
# config
router.register(r'users', views.UserViewSet)
router.register(r'dicttype', views.DictTypeViewSet)
router.register(r'dictlist', views.DictListViewSet)
router.register(r'systems', views.SystemViewSet)
router.register(r'modules', views.ModuleViewSet)
router.register(r'pages', views.PageViewSet)
router.register(r'divisions', views.DivisionViewSet)
router.register(r'divisions_admin', views.DivisionAdminViewSet)
router.register(r'users_divisions', views.UserDivisionViewSet)
router.register(r'roles', views.RoleViewSet)
router.register(r'users_roles', views.UserRoleViewSet)
# setup
router.register(r'post', views.PostViewSet)
router.register(r'organize', views.OrganizeViewSet)
router.register(r'organize_users', views.OrganizeUsersViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^$', views.s_index),
    url(r'^ver$', views.Ver.as_view()),
    url(r'^login$', views.Login.as_view()),
    url(r'^logout$', views.s_logout),
    url(r'^navlist$', views.NavList.as_view()),
    # 复选表格数据
    url(r'^pagegrid/', views.PageGrid.as_view()),
    # 下拉列表数据
    url(r'^dictcombo/', views.Dictcombo.as_view()),
    url(r'^userlist/', views.Userlist.as_view()),
    url(r'^divisionlist/', views.Divisionlist.as_view()),
    url(r'^rolelist/', views.Rolelist.as_view()),
    
    url(r'^', include(router.urls))
)