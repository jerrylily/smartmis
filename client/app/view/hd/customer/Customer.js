// view.hd.customer.Customer
// HD模块-客户管理-客户管理页面
Ext.define('Smart.view.hd.customer.Customer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_hd_customer_customer',
    requires: [
        'Ext.layout.container.Column',
        'Ext.form.field.Checkbox',
        'Smart.extend.column.Boolean',
        'Smart.view.widget.Grid',
        'Smart.view.hd.customer.CustomerCard'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'sm_grid',
            title: '客户管理',
            header: false,
            itemId: 's_page_hd_customer_customer',
            flex: 3,
            style: { borderRight: '1px solid #DDDDDD'},
            columns: [
                { text: '档案号', dataIndex: 'id', align: 'right', width: 60},
                { text: '名称',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false}, flex: 1},
                { text: '类别',  dataIndex: 'ctype', editor: {xtype: 'sm_dictcombo', dtype: 'hd_custype', allowBlank: false}, width: 80},
                { text: '性质',  dataIndex: 'cproperty', editor: {xtype: 'sm_dictcombo', dtype: 'hd_cusproperty', allowBlank: false}, width: 120},
                { text: '来源',  dataIndex: 'cfrom', editor: {xtype: 'sm_dictcombo', dtype: 'hd_cusfrom', allowBlank: false}, width: 120},
                { text: '结算',  dataIndex: 'paytype', editor: {xtype: 'sm_dictcombo', dtype: 'hd_paytype', allowBlank: false}, width: 80},
                { text: '国籍',  dataIndex: 'country', editor: {xtype: 'sm_dictcombo', dtype: 'hd_country', allowBlank: false}, width: 80 },
                { text: '城市',  dataIndex: 'city', editor: {xtype: 'sm_dictcombo', dtype: 'hd_city', allowBlank: false}, width: 80 },
                { text: '公司',  dataIndex: 'company', editor: { xtype: 'textfield', allowBlank: true}, width: 120 },
                { text: '创建人',  dataIndex: 'creator', editor: { xtype: 'textfield', allowBlank: true}, width: 80 },
                { text: '创建日期',  dataIndex: 'jiondate', width: 100 }
            ],
            store: 'hd.customer.Customer',
            editable: true,
            searchable: true,
            listeners: {
                itemclick: function(grid, rec, item, index, e, eOpts) {
                    var me = grid.up('sm_hd_customer_customer');
                    me.openCustomerCard({cid:rec.get('id'), name:rec.get('name')});
                }
            }
        }
    ],
    openCustomerCard: function(data) {
        var main = this.up('sm_main'),
            tabPanel = main.down('#s_tab'),
            tab = tabPanel.getComponent('hd_cus_'+data.cid),
            cpath = 'Smart.view.hd.customer.CustomerCard';
        if (tab) {
            tabPanel.setActiveTab(tab);
        } else {
            var page = Ext.create(cpath, {
                cid: data.cid,
                itemId: 'hd_cus_'+data.cid,
                title: data.name,
                glyph: 'xe009',
                closable: true
            });
            tabPanel.add(page);
            tabPanel.setActiveTab(page);
        }
    }
});