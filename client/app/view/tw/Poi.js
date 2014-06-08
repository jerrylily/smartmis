// view.tw.Poi
// 台湾自由行-兴趣点管理
Ext.define('Smart.view.tw.Poi', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_tw_poi',
    requires: [
        'Ext.grid.column.Action',
        'Smart.extend.form.MapField',
        'Smart.extend.form.TagField',
        'Smart.extend.form.SmartEditor',
        'Smart.view.widget.PhotoView',
        'Smart.view.widget.Grid'
    ],
    config: {
        queryParam: {district:0, pclass:'', dname:'', pname:''}   // 查询参数 eg: {pclass: 'JD', district: 3}
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    tools:[{type: 'help'}], // 显示标题栏帮助按钮
    items: [
        {
            xtype: 'container',
            width: 200,
            style: { borderRight: '1px solid #DDDDDD'},
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'treepanel',
                    itemId: 's_page_tw_poi_tree',
                    flex: 1,
                    displayField: 'name',
                    rootVisible: false,
                    columns: [
                        { xtype: 'treecolumn', text: '所属区划',  dataIndex: 'name', flex: 1}
                    ],
                    store: 'tw.District',
                    listeners: {
                        select: function(tree, record, index, e){
                            var me = this,
                                parent = me.up('sm_tw_poi'),
                                form = parent.down('form'),
                                did = record.getId();
                            if (did >= 0) {
                                parent.queryParam.district = did;
                                parent.queryParam.dname = record.get('name');
                                parent.loadData();
                            }
                        }
                    }
                }
            ]
        },
        {
            xtype: 'sm_grid',
            header: false,
            itemId: 's_page_tw_poi_list',
            flex: 1,
            margin: '0 0 0 8',
            style: { borderLeft: '1px solid #DDDDDD', borderRight: '1px solid #DDDDDD'},
            columns: [
                { 
                    xtype: 'actioncolumn', width: 40, text: '详',
                    items: [{
                        iconCls: 'smart-action-btn smart-action-btn-more',
                        tooltip: '点击查看详细内容',
                        handler: function(view, rowIndex, colIndex, item, e, record) {
                            var parent = view.up('sm_tw_poi'),
                                form = parent.down('form'),
                                contentBak = parent.down('#s_page_tw_poi_old_content'),
                                aid = record.get('id');
                            // 选中当前记录
                            view.getSelectionModel().select(record);
                             
                            // 读取当前文章详细内容，并填充form
                            if (aid > 0) {
                                var Poi = Ext.ModelManager.getModel('Smart.model.tw.PoiDetail');
                                Poi.load(aid, {
                                    success: function(record) {
                                        record.set('content',Ext.String.htmlDecode(record.get('content')));
                                        form.loadRecord(record);
                                        contentBak.setValue(Ext.String.htmlDecode(record.get('contentBak')));
                                        // 加载tag内容
                                        var tag = form.down('sm_tagfield');
                                        tag.setOwnerId(aid);    // 设置所属文章ID
                                        
                                        // 打开编辑面板
                                        parent.openEditPanel(true);
                                    }
                                });
                            }
                        }
                    }]
                },
                { text: '状态',  dataIndex: 'status', width: 90,
                    editor: { 
                        xtype: 'combo',
                        allowBlank: false ,
                        forceSelection: true,
                        autoSelect: true,
                        queryMode: 'local',
                        valueField: 'value',
                        displayField: 'name',
                        store: 'tw.PoiStatus'
                    },
                    renderer: function(value){
                        var store = Ext.getStore('tw.PoiStatus'),
                            rec = store.findRecord('value',value);
                        if (rec) {
                            return rec.get('name');
                        }
                        else {
                            return value;
                        }
                    }
                },
                { text: '名称', dataIndex: 'title', flex: 1, minWidth:200, editor: { xtype: 'textfield', allowBlank: false }},
                { text: '类别',  dataIndex: 'pclass', width: 120,
                    editor: { 
                        xtype: 'combo',
                        allowBlank: false ,
                        forceSelection: true,
                        autoSelect: true,
                        queryMode: 'local',
                        valueField: 'value',
                        displayField: 'name',
                        store: 'tw.PoiPclass'
                    },
                    renderer: function(value){
                        var store = Ext.getStore('tw.PoiPclass'),
                            rec = store.findRecord('value',value);
                        if (rec) {
                            return rec.get('name');
                        }
                        else {
                            return value;
                        }
                    }
                },
                { text: '权重', dataIndex: 'weight', width: 80, editor: { xtype: 'numberfield', minValue: 0, allowBlank: false }}
            ],
            store: 'tw.Poi',
            editable: true,
            searchable: true,
            autoLoadStore: false
        },
        {
            xtype: 'form',
            flex: 1,
            header: false,
            hidden: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            fieldDefaults: {
                labelWidth: 50
            },
            padding: '10 0 0 8',
            items: [{
                    xtype: 'displayfield',
                    name: 'title',
                    fieldLabel: '名称'
                },{
                    xtype: 'sm_mapfield',
                    name: 'latlng',
                    fieldLabel: '坐标'
                },{
                    xtype: 'sm_tagfield',
                    name: 'tag',
                    fieldLabel: '标签',
                    store: 'tw.Tags',
                    tagUrl: '/tw/tag/', // 关联tag的管理url
                    ownerModel: 'p'     // 关联tag的源model: Article - a ; poi - p
                    // 读取文章内容时加载 ownerId,由tagfield自动加载tag列表内容
                },{
                    xtype: 'sm_editor',
                    name: 'content',
                    flex: 1
                }
            ],
            bbar: [{
                text: '关闭',
                glyph: 'xe005',
                handler: function(btn) {
                    var parent = btn.up('sm_tw_poi');
                    // 隐藏编辑面板
                    parent.openEditPanel(false);
                }
            },'->',{
                text: '保存',
                glyph: 'xe020',
                handler: function(btn) {
                    var parent = btn.up('sm_tw_poi'),
                        formPanel = parent.down('form'),
                        form = formPanel.getForm(),
                        latlng = form.findField('latlng'),
                        content = form.findField('content'),
                        record = form.getRecord(),
                        contentBak = parent.down('#s_page_tw_poi_old_content');
                    
                    record.set('latlng', latlng.getValue());
                    record.set('content', Ext.String.htmlEncode(content.getValue()));
                    record.set('contentBak', Ext.String.htmlEncode(contentBak.getValue()));
                    record.save({
                        success: function(batch, opts){
                            sTop('POI点修改成功!');
                        }
                    });
                    
                    // 隐藏编辑面板
                    //parent.openEditPanel(false);
                }
            },'->',{
                text: '显示原始版本',
                itemId: 's_page_tw_poi_old_btn',
                glyph: 'xe016',
                handler: function(btn) {
                    var parent = btn.up('sm_tw_poi');
                    // 打开原始记录面板
                    parent.openOldPanel();
                }
            }]
        },{
            xtype: 'sm_photoview',
            title: '图片集',
            itemId: 's_page_tw_poi_photo',
            width: 260,
            hidden: true,
            margin: '0 0 0 8',
            style: { borderLeft: '1px solid #DDDDDD' },
            photoStore: 'tw.Photo'
        },{
            xtype: 'sm_editor',
            itemId: 's_page_tw_poi_old_content',
            name: 'contentBak',
            flex: 1,
            margin: '0 0 0 8',
            hidden: true
        }
    ],
    listeners: {
        afterrender: function() {
            var me = this,
                photo = me.down('sm_photoview'),
                grid = me.down('#s_page_tw_poi_list'),
                tool = grid.down('toolbar'),
                editor = me.down('sm_editor');
            // 添加类别筛选下拉框
            tool.insert(0, {
                xtype: 'combo',
                fieldLabel: '类别',
                labelWidth: 40,
                width: 180,
                queryMode: 'local',
                valueField: 'value',
                displayField: 'name',
                store: 'tw.PoiPclass',
                listeners: {
                    select: function(combo, records, e) {
                        var parent = combo.up('sm_tw_poi');
                        parent.queryParam.pclass = combo.getValue();
                        parent.queryParam.pname = combo.getRawValue();
                        parent.loadData();
                    }
                }
            });
            tool.insert(1,'->');
            // 设置photoview与editor的关联关系
            photo.setEditor(editor);
        }
    },
    // function
    loadData: function() {
        var me = this,
            form    = me.down('form'),
            photo = me.down('sm_photoview'),
            grid = me.down('sm_grid');
        // 当且仅当 区划与类别都有选择时进行数据加载
        if (me.queryParam.district > 0 && me.queryParam.pclass != '') {
            // 设置加载photo
            photo.setQueryParam({'district':me.queryParam.district, 'pclass':me.queryParam.pclass});
            photo.setTitle(me.queryParam.dname+'-'+me.queryParam.pname+'-图片集');
            // 设置加载grid
            var store = grid.getStore(),
                proxy = store.getProxy(),
                model = proxy.getModel(),
                fields = model.getFields(),
                districtField = Ext.Array.findBy(fields, function(field, index){return (field.name == 'district');}),
                pclassField = Ext.Array.findBy(fields, function(field, index){return (field.name == 'pclass');});
            proxy.extraParams['district'] = me.queryParam.district;
            proxy.extraParams['pclass'] = me.queryParam.pclass;
            // 设置model默认值
            districtField.defaultValue = me.queryParam.district;
            pclassField.defaultValue = me.queryParam.pclass;
            grid.getSelectionModel().deselectAll(); // 取消选择行
            store.load();
            grid.setBtnAddEnable(true); // 不自动加载数据的grid的添加按钮不可用，需要加载数据后手动打开
            
            // 关闭编辑面板
            me.openEditPanel(false);
        }
    },
    // 打开关闭编辑面板
    // photo面板随详细内容面板打开收起
    // 参数 open ＝ true 打开 ; 反之关闭
    openEditPanel: function(open) {
        var me = this,
            grid    = me.down('sm_grid'),
            form    = me.down('form'),
            photo   = me.down('sm_photoview');
        if (open) {
            grid.hide();
            form.show();
            photo.show();
            me.toggleOldPanel(false);
        }else{
            grid.show();
            form.hide();
            photo.hide();
            me.toggleOldPanel(false);
        }
    },
    // 打开关闭原始文档面板
    openOldPanel: function() {
        var me = this,
            grid    = me.down('sm_grid'),
            form    = me.down('form'),
            photo   = me.down('sm_photoview');
            old     = me.down('#s_page_tw_poi_old_content');
        if (old.isHidden()) {
            grid.hide();
            form.show();
            photo.hide();
            me.toggleOldPanel(true);
        }else{
            grid.hide();
            form.show();
            photo.show();
            me.toggleOldPanel(false);
        }
    },
    toggleOldPanel: function(show) {
        var me= this,
            old = me.down('#s_page_tw_poi_old_content'),
            btn = me.down('#s_page_tw_poi_old_btn');
        if (show) {
            btn.setText('关闭原始版本');
            old.show();
        }else{
            btn.setText('显示原始版本');
            old.hide();
        }
    }
});