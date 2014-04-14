// view.config.Authorization
// 系统设置-授权设置页面
Ext.define('Smart.view.config.Authorization', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_config_authorization',
    requires: [
        'Ext.grid.property.Grid',
        'Ext.layout.container.Column',
        'Smart.view.widget.Grid'
    ],
    config: {
        store: null // 存放读取数据的自定义store
    },
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'propertygrid',
            title: '授权信息',
            itemId: 's_page_config_authorization_system',
            flex: 2,
            style: { borderRight: '1px solid #DDDDDD'},
            sortableColumns: false,
            sourceConfig: {
                id: {displayName: '序号', editor: {disabled: true}},
                name: {displayName: '授权单位', type: 'string'},
                code: {displayName: '授权码', type: 'string'},
                num: {displayName: '授权数', type: 'number'},
                limit: {displayName: '授权期限', type: 'date'},
                contact: {displayName: '联系人', type: 'string'},
                phone: {displayName: '联系电话', type: 'string'},
                address: {displayName: '联系地址', type: 'string'},
                zipcode: {displayName: '邮政编码', type: 'string'}
            }
        },{xtype: 'splitter'},
        {
            xtype: 'grid', 
            title: '授权模块',
            itemId: 's_page_config_authorization_modules',
            flex: 3,
            style: { borderLeft: '1px solid #DDDDDD'},
            selType: 'checkboxmodel',
            columns: [
                { text: 'id', dataIndex: 'id', align: 'right', width: 50},
                { text: '模块名称',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '字符图标', dataIndex: 'glyph', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '代码标识', dataIndex: 'code', editor: { xtype: 'textfield', allowBlank: false }, flex: 2 }
            ],
            store: 'config.Module',
            listeners: {
                afterrender: function(grid, e) {
                    var panel = grid.up('panel'),
                        store = grid.getStore();
                    // 列表数据加载完毕之后再读取填充数据
                    store.load({
                        scope: panel,
                        callback: function(records, operation, success) {
                            var panel = this;
                            // store 加载错误时，关闭本panel，防止多余操作
                            if (!success) {
                                panel.close();
                                return;
                            }
                            // 加载填充数据, panel的自定义store
                            var pstore = Ext.getStore('config.System');
                            panel.setStore(pstore);
                            pstore.load({
                                scope: panel,
                                callback: function(records, operation, success) {
                                    var panel = this,
                                        pgrid = panel.down('#s_page_config_authorization_system'),
                                        grid = panel.down('#s_page_config_authorization_modules'),
                                        modules = grid.getStore(),
                                        ppstore = panel.getStore();
                                    // store 加载错误时，关闭本panel，防止多余操作
                                    if (!success) {
                                        panel.close();
                                        return;
                                    }
                                    // 没有记录时，添加记录
                                    var rec = null;
                                    if (Ext.isEmpty(records)) {
                                        var model = ppstore.getProxy().getModel();
                                        ppstore.insert(0, new model());
                                        rec = ppstore.getAt(0);
                                        rec.data.module = [];
                                        rec.raw = rec.data;
                                    }
                                    // 根据store返回值设定pgrid的source
                                    pgrid.setSource(ppstore.getAt(0).data);
                                    ppstore.getAt(0).raw.module.forEach(function(mid) {
                                        grid.getSelectionModel().select(modules.getById(mid), true); // true - 保留之前的选项
                                    });
                                }
                            }); // pstore.load
                        } // callback
                    }); // store.load
                }
            }
        }
    ],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        layout: {
            pack: 'center'
        },
        items: [
            {
                itemId: 's_auth_btn_reset',
                text: '取消',
                glyph: 'xe005',
                scale: 'medium',
                handler: function(btn, e) {
                    var parent = btn.up('panel');
                    parent.close();
                }
            },'-',
            {
                itemId: 's_auth_btn_save',
                text: '保存',
                glyph: 'xe006',
                scale: 'medium',
                handler: function(btn, e) {
                    var parent = btn.up('panel'),
                        grid = parent.down('#s_page_config_authorization_modules'),
                        modules = [],
                        selected = grid.getSelectionModel().getSelection(),
                        store = parent.getStore(),
                        model = store.getAt(0);
                    selected.forEach(function(sel) {
                        modules.push(sel.data.id);
                    });
                    model.data.module = modules;
                    store.getAt(0).raw = store.getAt(0).data;
                    model.setDirty();
                    store.sync({
                        success: function(){
                            //console.log(this);
                        },
                        failure: function(){
                            // 失败后回复原记录
                            this.getStore().rejectChanges();
                        },
                        scope: parent
                    });
                    
                }
            }
        ]
    }]
});