// view.config.Pages
// 系统设置-功能设置页面
Ext.define('Smart.view.config.Pages', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_config_pages',
    requires: [
        'Ext.layout.container.Column',
        'Smart.view.widget.Grid'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'sm_grid',
            title: '功能模块',
            itemId: 's_page_config_pages_module',
            flex: 2,
            style: { borderRight: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '模块名称',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '字符图标', dataIndex: 'glyph', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '代码标识', dataIndex: 'code', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 }
            ],
            store: 'config.Module',
            editable: true,
            childs: [
                {itemId: 's_page_config_pages_pages', linkField: 'module'}
            ]
        },{xtype: 'splitter'},
        {
            xtype: 'sm_grid', 
            title: '[]-功能页',    // []- 不可省略, 正则匹配更新标题
            itemId: 's_page_config_pages_pages',
            flex: 3,
            style: { borderLeft: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '页名称',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { text: '字符图标', dataIndex: 'glyph', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '图标样式', dataIndex: 'icon', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { text: '代码标识', dataIndex: 'code', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 },
                { xtype: 'sm_booleancolumn', text: '置顶', dataIndex: 'is_top', editor: { xtype: 'checkbox' }, flex: 1 }
            ],
            store: 'config.Page',
            editable: true,
            autoLoadStore: false, //不自动加载数据
            parent: {itemId:'s_page_config_pages_module', linkField: 'module', value: 0}
        }
    ]
});