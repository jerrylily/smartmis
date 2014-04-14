// view.setup.Settings
// 管理中心-参数设置页面
Ext.define('Smart.view.config.Settings', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_config_settings',
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
            title: '系统字典类别',
            itemId: 's_page_config_settings_dicttype',
            flex: 2,
            style: { borderRight: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '字典类别',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '字典说明', dataIndex: 'memo', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 }
            ],
            store: 'config.DictType',
            editable: true,
            childs: [
                {itemId: 's_page_config_settings_dictlist', linkField: 'dicttype', titleField: 'memo'}
            ]
        },{xtype: 'splitter'},
        {
            xtype: 'sm_grid', 
            title: '[]-字典项',    // []- 不可省略, 正则匹配更新标题
            itemId: 's_page_config_settings_dictlist',
            flex: 2,
            style: { borderLeft: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '键',  dataIndex: 'key', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { text: '值', dataIndex: 'value', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { text: '顺序', dataIndex: 'order', editor: { xtype: 'numberfield', allowBlank: false, minValue: 0, value: 1}, flex: 1 }
            ],
            store: 'config.DictList',
            editable: true,
            autoLoadStore: false, //不自动加载数据
            parent: {itemId:'s_page_config_settings_dicttype', linkField: 'dicttype', value: 0}
        }
    ]
});