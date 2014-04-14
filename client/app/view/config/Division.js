// view.config.Division
// 系统设置-单位设置页面
Ext.define('Smart.view.config.Division', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_config_division',
    requires: [
        'Ext.layout.container.Column',
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
            title: '单位管理',
            itemId: 's_page_config_division_division',
            flex: 3,
            style: { borderRight: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '单位名称',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { text: '代码标识', dataIndex: 'code', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '域名', dataIndex: 'domain', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 }
            ],
            store: 'config.Division',
            editable: true,
            searchable: true,
            childs: [
                {itemId: 's_page_config_division_admin', linkField: 'division'}
            ]
        },{xtype: 'splitter'},
        {
            xtype: 'sm_combogrid', 
            title: '[]-系统管理员',    // []- 不可省略, 正则匹配更新标题
            itemId: 's_page_config_division_admin',
            flex: 2,
            style: { borderLeft: '1px solid #DDDDDD'},
            columns: [
                //{ text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '编号', dataIndex: 'user', width: 50},
                { text: '用户名', dataIndex: 'username', flex: 2 },
                { text: '真实姓名', dataIndex: 'name', flex: 2 }
            ],
            store: 'config.Division_admin',
            comboStore: 'config.UserCombobox',
            listField: 'user',
            parent: {itemId:'s_page_config_division_division', linkField: 'division', value: 0}
        }
    ]
});