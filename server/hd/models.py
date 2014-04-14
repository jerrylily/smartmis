 # encoding: utf-8

import datetime
from django.db import models
from django import forms
from django.forms import ModelForm

class Customer(models.Model):
    """ 客户
    """
     # 基本信息
    name        = models.CharField(max_length=32, blank=True)                               # 客户姓名,必填项
    ctype       = models.CharField(max_length=4, blank=True, null=True)                     # 客户类别(1-个人客户 2-企业客户)
    cproperty   = models.CharField(max_length=16, blank=True, null=True)                    # 客户性质(combo 选择)
    cfrom       = models.CharField(max_length=16, blank=True, null=True)                    # 客户来源(combo 选择)
    country     = models.CharField(max_length=2, blank=True, null=True)                     # 国籍(combo 选择 二字代码)
    city        = models.CharField(max_length=16, blank=True, null=True)                    # 居住地(combo 选择)
    company     = models.CharField(max_length=64, blank=True, null=True)                    # 公司行号(自由行文)
    email       = models.EmailField(blank=True, null=True)                                  # 电子邮箱(自由行文)
     # 结算
    paytype     = models.CharField(max_length=4, blank=True, null=True)                     # 结算方式(combo 选择)
    
    memo        = models.CharField(max_length=1024, blank=True, null=True)                  # 备注(自由行文,将introducer介绍人并入)
     # 系统
    creator     = models.CharField(max_length=4, blank=True, null=True)                     # 建档人(员工用户名简写: tl,hf)
    jiondate    = models.DateField(blank=True, null=True, auto_now_add=True)                # 建档时间(日期格式:1997-10-01,y-m-d)
    moveto      = models.IntegerField(default=0)                                            # 信息并入客户id,去重处理的标识
    is_active   = models.BooleanField(default=True)                                         # 是否有效,去重后将记录标识为无效
     # 历史编号
    cuid        = models.CharField(max_length=10, blank=True, null=True)                    # 个人客户编号,CU00000000,与历史数据库关联

class Phone(models.Model):
    """ 电话信息类
        - 乘机人的电话记在乘机人名下
    """
    customer    = models.ForeignKey(Customer)
    ptype       = models.CharField(max_length=4, blank=True, null=True)                     # 电话类别(1-手机,2-座机 combo 选择)
    pnumber     = models.CharField(max_length=16)                                           # 电话号码
    pext        = models.CharField(max_length=8, blank=True, null=True)                     # 分机号
    memo        = models.CharField(max_length=64, blank=True, null=True)                    # 备注

class Address(models.Model):
    """ 客户地址信息类
        - 地址类别:家庭、单位、送票、收款
        - 地址内容:地址、邮编、联系人、电话、状态 etc.
    """
    customer    = models.ForeignKey(Customer)
    atype       = models.CharField(max_length=4, blank=True, null=True)                     # 地址类别(0-未知,1-家庭,2-工作,3-送票,4-收款 combo 选择)
    address     = models.CharField(max_length=256, blank=True, null=True)                   # 地址
    memo        = models.CharField(max_length=64, blank=True, null=True)                    # 备注(联系人contact+联系电话phone)

class MilesCard(models.Model):
    """ 客户里程卡信息类
        - 针对于所有个体(个人客户、联系人、乘机人)的里程卡累计信息存储
        - 里程卡内容:航空公司、卡号、累计里程 etc.
    """
    customer    = models.ForeignKey(Customer)
    mtype       = models.CharField(max_length=2, blank=True, null=True)                     # 里程卡类别(0-未知,1-CA,... combo 选择)
    cardno      = models.CharField(max_length=32, blank=True, null=True)                    # 里程卡号
    memo        = models.CharField(max_length=64, blank=True, null=True)                    # 备注

class Invoice(models.Model):
    """ 客户发票信息类
        - 发票抬头信息存储
        - 与业务模块中的发票记录区分开
        - 发票信息:抬头、内容 etc.
    """
    customer    = models.ForeignKey(Customer)
    title       = models.CharField(max_length=256, blank=True, null=True)                   # 发票抬头
    memo        = models.CharField(max_length=64, blank=True, null=True)                    # 备注

class Passenger(models.Model):
    """ 乘机人信息类
    """
    customer    = models.ForeignKey(Customer)
    name        = models.CharField(max_length=64)                                           # 姓名
    gender      = models.CharField(max_length=2, blank=True, null=True)                     # 性别(combo 选择)
    ptype       = models.CharField(max_length=16, blank=True, null=True)                    # 证件类别(1-身份证,2-护照,3-军官证,4-台胞证.combo 选择)
    number      = models.CharField(max_length=32, blank=True, null=True)                    # 证件号码
    country     = models.CharField(max_length=2, blank=True, null=True)                     # 证件标注国籍(国家二字代码,eg:CN combo 选择)
    birthday    = models.DateField(blank=True, null=True)                                   # 证件标注生日
    valid       = models.DateField(blank=True, null=True)                                   # 证件标注有效期
    milecards   = models.CharField(max_length=128, blank=True, null=True)                   # 里程卡,多个里程卡之间以','隔开
    phone       = models.CharField(max_length=64, blank=True, null=True)                    # 联系电话
    email       = models.EmailField(blank=True, null=True)                                  # 电子邮箱
    memo        = models.CharField(max_length=512, blank=True, null=True)                   # 备注
