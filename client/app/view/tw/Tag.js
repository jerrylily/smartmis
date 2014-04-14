// view.tw.Tag
// 台湾自由行-标签管理
Ext.define('Smart.view.tw.Tag', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_tw_tag',
    requires: [
        'Smart.view.widget.Grid'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    tools:[{type: 'help'}], // 显示标题栏帮助按钮
    items: [
        {
            xtype: 'sm_grid',
            header: false,
            itemId: 's_page_tw_tag_list',
            flex: 1,
            columns: [
                { text: '编号', dataIndex: 'id', width:100},
                { text: '名称', dataIndex: 'tag', flex: 3, minWidth:200, editor: { xtype: 'textfield', allowBlank: false }},
                { text: '热度', dataIndex: 'hot', flex: 1, editor: { xtype: 'numberfield', minValue: 0, allowBlank: false }}
            ],
            store: 'tw.Tags',
            editable: true,
            searchable: true,
            autoLoadStore: true
        }
    ]
});