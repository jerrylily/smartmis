// view.config.Roles
// 系统设置-分部角色设置
Ext.define('Smart.view.config.Roles', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_config_roles',
    requires: [
        'Ext.layout.container.Column',
        'Smart.view.widget.Grid',
        'Smart.view.widget.PageGrid'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'sm_grid', 
            title: '角色管理',
            itemId: 's_page_config_roles_roles',
            flex: 2,
            style: { borderLeft: '1px solid #DDDDDD', borderRight: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '名称', dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 }
            ],
            store: 'config.Role',
            editable: true,
            autoLoadStore: false, //不自动加载数据，选择所辖单位后加载数据
            listeners: {
                select: function(rs, record, index, e) {
                    var me = this,
                        pagegrid = me.up('panel').down('#s_page_config_roles_pagegrid');
                    pagegrid.setCheckedData(record);
                }
            }
        },{xtype: 'splitter'},
        {
            xtype: 'sm_pagegrid',
            title: '功能列表树',
            itemId: 's_page_config_roles_pagegrid',
            flex: 2,
            style: { borderLeft: '1px solid #DDDDDD'},
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '名称',  dataIndex: 'page', flex: 2 },
                { text: '代码标识', dataIndex: 'code', flex: 3 }
            ],
            parent: {itemId:'s_page_config_roles_roles', record: null}
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
                width: 190,
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
                                proxy = store.getProxy(),
                                model = proxy.getModel(),
                                fields = model.getFields(),
                                field = Ext.Array.findBy(
                                    fields,
                                    function(f, index){
                                        return (f.name == 'division');
                                    }
                                ); // 查找关联field;
                            proxy.extraParams['division'] = combo.getValue();
                            field.defaultValue = combo.getValue();  // 设置当前module的默认值为mid，post和put时，会自动提交
                            
                            grid.getSelectionModel().deselectAll(); // 取消选择行
                            store.load();
                            grid.setBtnAddEnable(true); // 不自动加载数据的grid的添加按钮不可用，需要加载数据后手动打开
                        }
                    }
                }
            });
        }
    }// listeners
});