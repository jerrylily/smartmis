// view.hd.customer.CustomerCard
// HD模块-客户管理-客户卡片页面
Ext.define('Smart.view.hd.customer.CustomerCard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_hd_customer_customercard',
    requires: [
        'Ext.layout.container.Column',
        'Ext.form.field.Checkbox',
        'Smart.extend.form.SmartEditor',
        'Smart.extend.form.DictCombo',
        'Smart.view.widget.Grid'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    // 自定义参数
    config: {
        cid: 0,     // 0-为新建客户
        rec: null,  // 用户基本信息记录集
        memo: null  // 用户备注记录集
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
        // 加载store
        if (me.cid > 0) {
            me.setChildStore('phone');
            me.setChildStore('address');
            me.setChildStore('milesCard');
            me.setChildStore('invoice');
            me.setChildStore('passenger');
            
        }
    },
    items: [
        {
            // 左侧面板
            xtype: 'panel',
            title: '客户基本信息',
            header: false,
            width: 300,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'propertygrid',
                itemId: 's_page_config_authorization_system',
                height: 270,
                margin: '8 8 0 8',
                style: { borderLeft: '1px solid #DDDDDD',borderRight: '1px solid #DDDDDD',borderBottom: '1px solid #DDDDDD'},
                sortableColumns: false,
                hideHeaders: true,
                nameColumnWidth: 90,
                sourceConfig: {
                    id: {displayName: '档案号', editor: {disabled: true}},
                    name: {displayName: '名称', type: 'string'},
                    ctype: {displayName: '类别', type: 'string', editor: {xtype: 'sm_dictcombo', dtype: 'hd_custype'}},
                    cproperty: {displayName: '性质', type: 'string', editor: {xtype: 'sm_dictcombo', dtype: 'hd_cusproperty'}},
                    cfrom: {displayName: '来源', type: 'string', editor: {xtype: 'sm_dictcombo', dtype: 'hd_cusfrom'}},
                    paytype: {displayName: '结算', type: 'string', editor: {xtype: 'sm_dictcombo', dtype: 'hd_paytype'}},
                    country: {displayName: '国籍', type: 'string', editor: {xtype: 'sm_dictcombo', dtype: 'hd_country'}},
                    city: {displayName: '城市', type: 'string', editor: {xtype: 'sm_dictcombo', dtype: 'hd_city'}},
                    company: {displayName: '行号', type: 'string'},
                    email: {displayName: '邮箱', type: 'string'}
                },
                listeners: {
                    propertychange: function(source, recordId, value, oldValue, e) {
                        // 基本项有改动时自动提交
                        var me = this.up('sm_hd_customer_customercard');
                        me.saveCusProp();
                    }
                }
            },{xtype: 'splitter'},
            {
                xtype: 'panel',
                flex: 1,
                margin: '0 8 0 8',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items:[{
                    xtype: 'sm_editor',
                    flex: 1
                }],
                bbar: [{
                    text: '恢复',
                    glyph: 'xe01f',
                    handler: function(btn) {
                        var me = btn.up('sm_hd_customer_customercard'),
                            html = me.down('htmleditor');
                        html.setValue(Ext.String.htmlDecode(me.memo.get('memo')));
                    }
                },'->',{
                    text: '保存',
                    glyph: 'xe020',
                    handler: function(btn) {
                        var me = btn.up('sm_hd_customer_customercard'),
                            html = me.down('htmleditor');
                        me.memo.set('memo',Ext.String.htmlEncode(html.getValue()));
                        me.memo.save();
                    }
                }]
            }]
        },//{xtype: 'splitter'},
        {
            // 右侧面板
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'tabpanel',
                height: 230,
                style: { borderLeft: '1px solid #DDDDDD', borderRight: '1px solid #DDDDDD'},
                items: [{
                    xtype: 'sm_grid',
                    title: '电话信息',
                    glyph: 'xe017',
                    itemId: 's_page_hd_customer_customer_phone',
                    columns: [
                        {xtype: 'rownumberer'},
                        { text: '类型', dataIndex: 'ptype', editor: {xtype: 'sm_dictcombo', dtype: 'hd_cusphone', allowBlank: false}, flex: 1 },
                        { text: '号码', dataIndex: 'pnumber', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                        { text: '分机', dataIndex: 'pext', editor: { xtype: 'textfield', allowBlank: true }, flex: 1 },
                        { text: '备注', dataIndex: 'memo', editor: { xtype: 'textfield', allowBlank: true }, flex: 3 }
                    ],
                    editable: true,
                    pageable: false,
                    searchable: true
                },{
                    xtype: 'sm_grid',
                    title: '地址信息',
                    glyph: 'xe018',
                    itemId: 's_page_hd_customer_customer_address',
                    columns: [
                        {xtype: 'rownumberer'},
                        { text: '类型', dataIndex: 'atype', editor: {xtype: 'sm_dictcombo', dtype: 'hd_cusaddress', allowBlank: false}, flex: 1 },
                        { text: '地址', dataIndex: 'address', editor: { xtype: 'textfield', allowBlank: false }, flex: 3 },
                        { text: '备注', dataIndex: 'memo', editor: { xtype: 'textfield', allowBlank: true }, flex: 2 }
                    ],
                    editable: true,
                    pageable: false,
                    searchable: true
                },{
                    xtype: 'sm_grid',
                    title: '里程卡信息',
                    glyph: 'xe019',
                    itemId: 's_page_hd_customer_customer_milescard',
                    columns: [
                        {xtype: 'rownumberer'},
                        { text: '类型', dataIndex: 'mtype', editor: {xtype: 'sm_dictcombo', dtype: 'hd_cusmilescard', allowBlank: false}, flex: 1 },
                        { text: '卡号', dataIndex: 'cardno', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                        { text: '备注', dataIndex: 'memo', editor: { xtype: 'textfield', allowBlank: true }, flex: 3 }
                    ],
                    editable: true,
                    pageable: false,
                    searchable: true
                },{
                    xtype: 'sm_grid',
                    title: '发票信息',
                    glyph: 'xe01a',
                    itemId: 's_page_hd_customer_customer_invoice',
                    columns: [
                        {xtype: 'rownumberer'},
                        { text: '抬头', dataIndex: 'title', editor: { xtype: 'textfield', allowBlank: false }, flex: 3 },
                        { text: '备注', dataIndex: 'memo', editor: { xtype: 'textfield', allowBlank: true }, flex: 2 }
                    ],
                    editable: true,
                    pageable: false,
                    searchable: true
                }]
            },{xtype: 'splitter'},{
                // 右下方 tab 区
                xtype: 'tabpanel',
                flex: 1,
                style: { borderLeft: '1px solid #DDDDDD', borderRight: '1px solid #DDDDDD'},
                items: [{
                    xtype: 'sm_grid',
                    title: '乘机人',
                    glyph: 'xe01b',
                    itemId: 's_page_hd_customer_customer_passenger',
                    columns: [
                        {xtype: 'rownumberer'},
                        { text: '姓名', dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, width: 120},
                        { text: '性别', dataIndex: 'gender', editor: { xtype: 'sm_dictcombo', dtype: 'gender_en', allowBlank: false }, width: 70},
                        { text: '证件类别', dataIndex: 'ptype', editor: { xtype: 'sm_dictcombo', dtype: 'hd_cuspid', allowBlank: false }, width: 100},
                        { text: '证件号', dataIndex: 'number', editor: { xtype: 'textfield', allowBlank: false }, width: 180},
                        { text: '国籍', dataIndex: 'country', editor: { xtype: 'sm_dictcombo', dtype: 'hd_country', allowBlank: false }, width: 70},
                        { text: '生日', dataIndex: 'birthday', editor: { xtype: 'textfield', allowBlank: true }, width: 100},
                        { text: '有效期', dataIndex: 'valid', editor: { xtype: 'textfield', allowBlank: true }, width: 100},
                        { text: '里程卡', dataIndex: 'milecards', editor: { xtype: 'textfield', allowBlank: true }, width: 120},
                        { text: '联系电话', dataIndex: 'phone', editor: { xtype: 'textfield', allowBlank: true }, width: 120},
                        { text: '电子邮件', dataIndex: 'email', editor: { xtype: 'textfield', allowBlank: true }, width: 150},
                        { text: '备注', dataIndex: 'memo', editor: { xtype: 'textfield', allowBlank: true }, width: 200}
                    ],
                    editable: true,
                    pageable: true,
                    searchable: true
                },{
                    title: '消费记录',
                    glyph: 'xe01c'
                },{
                    title: '事务日志',
                    glyph: 'xe01d'
                },{
                    title: '通话记录',
                    glyph: 'xe01e'
                }]
            }]
        },{xtype: 'splitter'},{
            title: '相关人',
            width: 150,
            collapsible: true,
            collapsed: true,
            collapseMode: 'header',
            collapseDirection: 'left',
            animCollapse: false,
            style: { borderLeft: '1px solid #DDDDDD'}
        }
    ],
    listeners: {
        afterrender: function(panel, e) {
            var me = this,
                pg = me.down('propertygrid'),
                he = me.down('htmleditor'),
                Customer    = Ext.ModelManager.getModel('Smart.model.hd.customer.CustomerPropty'),
                CusMemo     = Ext.ModelManager.getModel('Smart.model.hd.customer.CustomerMemo');
                
            // 已建档客户
            if (me.cid > 0) {
                // 加载客户基本数据
                Customer.load(me.cid, {
                    success: function(cus) {
                        me.setRec(cus);             // 设置全局参数
                        pg.setSource(cus.data);     // 填充property grid
                    }
                });
                // 加载客户备注记录集
                CusMemo.load(me.cid, {
                    success: function(memo) {
                        me.setMemo(memo);           // 设置全局参数
                        he.setValue(Ext.String.htmlDecode(memo.get('memo')));   // 解码html,填充备注栏
                    }
                });
                // 
            } else {
                // 新建客户
                rec = new Customer();
                pg.setSource(rec.data);
                me.rec = rec;
            }
        }
    },// listeners
    
    // function
    // 处理子表的store
    setChildStore: function(pname) {
        var me = this,
            grid = this.down('#s_page_hd_customer_customer_'+pname.toLowerCase()),
            Model = Ext.ModelManager.getModel('Smart.model.hd.customer.'+Ext.String.capitalize(pname)),
            pmodel = 'Smart.model.hd.customer.'+Ext.String.capitalize(pname)+'_'+me.cid;
        Ext.define(pmodel,{extend: Model});
        //console.log(pmodel);
        var store = new Smart.extend.data.Store({
                model: pmodel,
                autoLoad: true
            });
        store.getProxy().setExtraParam('customer', me.cid);
        grid.bindStore(store);
    },
    // 提交保存基本信息
    saveCusProp: function() {
        var me = this;
        if (me.rec) {
            me.rec.save({
                callback: function(rec,opt,success) {
                    // 保存成功
                    if (success) {
                        //me.setCid(rec.get('id'));
                        me.setTitle(rec.get('name'));
                    }
                }
            });
        }
    }
});