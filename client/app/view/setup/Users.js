// view.setup.Users
// 管理中心-用户管理页面
Ext.define('Smart.view.setup.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_setup_users',
    requires: [
        'Ext.layout.container.Column',
        'Ext.form.field.Checkbox',
        'Smart.extend.column.Boolean',
        'Smart.view.widget.Grid',
        'Smart.view.widget.ComboGrid',
        'Smart.extend.form.EditCombo'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'sm_grid',
            title: '用户基本信息管理',
            itemId: 's_page_setup_users_userlist',
            flex: 3,
            style: { borderRight: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '用户名',  dataIndex: 'username', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { text: '工号', dataIndex: 'last_name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '姓名', dataIndex: 'first_name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: 'EMAIL', dataIndex: 'email', editor: { xtype: 'textfield', allowBlank: false , vtype: 'email'}, flex: 4 },
                { xtype: 'sm_booleancolumn', text: '有效', dataIndex: 'is_active', editor: { xtype: 'checkbox' }, flex: 1 }
            ],
            store: 'setup.Users',
            editable: true,
            searchable: true,
            autoLoadStore: false, //不自动加载数据，选择所辖单位后加载数据
            childs: [
                {itemId: 's_page_setup_users_role', linkField: 'user', titleField: 'first_name'}
            ]
        },{xtype: 'splitter'},
        {
            xtype: 'sm_combogrid', 
            title: '[]-拥有角色',    // []- 不可省略, 正则匹配更新标题
            itemId: 's_page_setup_users_role',
            flex: 1,
            style: { borderLeft: '1px solid #DDDDDD'},
            columns: [
                //{ text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '编号', dataIndex: 'role', width: 50 },
                { text: '角色名称', dataIndex: 'name', flex: 2 }
            ],
            store: 'setup.Users_role',
            comboStore: 'setup.RoleCombobox',
            listField: 'role',
            parent: {itemId:'s_page_setup_users_userlist', linkField: 'user', value: 0}
        }
    ],
    listeners: {
        afterrender: function(panel, e) {
            var tool = panel.down('toolbar'),
                grid = panel.down('sm_grid'),
                store = grid.getStore(),
                proxy = store.getProxy();
            proxy.extraParams['division'] = 0;  // 初始给division＝0，防止查询栏查询全局记录
            
            tool.insert(0, {
                xtype: 'combo',
                fieldLabel: '所辖单位',
                labelWidth: 70,
                width: 200,
                //forceSelection: true,
                queryMode: 'remote',
                valueField: 'value',
                displayField: 'text',
                store: 'config.DivisionCombobox',
                listeners: {
                    select: function(combo, records, e) {
                        if (combo.value > 0) {
                            // 1. 给用户列表添加 division 的筛选参数
                            var grid = combo.up('sm_grid'),
                                store = grid.getStore(),
                                proxy = store.getProxy();
                            proxy.extraParams['division'] = combo.getValue();
                            grid.getSelectionModel().deselectAll(); // 取消选择行
                            store.load();
                            grid.setBtnAddEnable(true); // 不自动加载数据的grid的添加按钮不可用，需要加载数据后手动打开
                            // 2. 给添加角色的combo和grid 添加 division 的筛选参数
                            var cb = combo.up('sm_setup_users'),
                                cl = cb.down('sm_combogrid'),
                                cb_role = cl.down('combo'),
                                cb_store = cb_role.getStore(),
                                cb_proxy = cb_store.getProxy(),
                                cl_store = cl.getStore(),
                                cl_proxy = cl_store.getProxy();
                            cb_proxy.extraParams['division'] = combo.getValue();
                            cl_store.loadData([], false);
                            cl_proxy.extraParams['division'] = combo.getValue();
                        }
                    }
                }
            });
            tool.insert(1,'->');
            tool.insert(6, {
                itemId: 's_grid_btn_key',
                text: '重置',
                glyph: 'xe00a',
                handler: function(btn, e) {
                    var parent = btn.up('grid');
                    if (parent && parent.getStore()) {
                        var recs = parent.getSelectionModel().getSelection(),
                            position = parent.getSelectionModel().getCurrentPosition(),
                            store = parent.getStore();
                        if (position) {
                            Ext.MessageBox.confirm('确认', '确定要重置【<span class=s_red>'+recs[0].get('first_name')+'</span>】的密码为【<span class=s_red>666666</span>】吗？', function(btn) {
                                if (btn == 'yes') {
                                    if (recs.length == 1) {
                                        recs[0].set('psw','666666');
                                        recs[0].save();
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }// listeners
});