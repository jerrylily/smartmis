// view.config.Users
// 系统设置-用户设置设置页面
Ext.define('Smart.view.config.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_config_users',
    requires: [
        'Ext.layout.container.Column',
        'Ext.form.field.Checkbox',
        'Smart.extend.column.Boolean',
        'Smart.view.widget.Grid',
        'Smart.view.widget.ComboGrid'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'sm_grid',
            title: '用户基本信息管理',
            itemId: 's_page_config_users_userlist',
            flex: 3,
            style: { borderRight: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '用户名',  dataIndex: 'username', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { text: '工号', dataIndex: 'last_name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '姓名', dataIndex: 'first_name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: 'EMAIL', dataIndex: 'email', editor: { xtype: 'textfield', allowBlank: false , vtype: 'email'}, flex: 4 },
                { xtype: 'sm_booleancolumn', text: '超管', dataIndex: 'is_superuser', editor: { xtype: 'checkbox' }, flex: 1 },
                { xtype: 'sm_booleancolumn', text: '有效', dataIndex: 'is_active', editor: { xtype: 'checkbox' }, flex: 1 }
            ],
            store: 'config.Users',
            editable: true,
            searchable: true,
            childs: [
                {itemId: 's_page_config_users_division', linkField: 'user', titleField: 'first_name'}
            ]
        },{xtype: 'splitter'},
        {
            xtype: 'sm_combogrid', 
            title: '[]-所属单位',    // []- 不可省略, 正则匹配更新标题
            itemId: 's_page_config_users_division',
            flex: 1,
            style: { borderLeft: '1px solid #DDDDDD'},
            columns: [
                //{ text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '编号', dataIndex: 'division', width: 50 },
                { text: '单位名称', dataIndex: 'name', flex: 2 }
            ],
            store: 'config.Users_division',
            comboStore: 'config.DivisionCombobox',
            listField: 'division',
            parent: {itemId:'s_page_config_users_userlist', linkField: 'user', value: 0}
        }
    ],
    listeners: {
        afterrender: function(panel, e) {
            var tool = panel.down('sm_grid toolbar');
            tool.insert(4, {
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