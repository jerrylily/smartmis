// view.tw.District
// 管理中心-组织架构管理页面
Ext.define('Smart.view.tw.District', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_tw_district',
    requires: [
        'Ext.grid.column.Action',
        'Smart.extend.form.MapField',
        'Smart.extend.form.SmartEditor',
        'Smart.view.widget.EditTree',
        'Smart.view.widget.PhotoView'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    tools:[{type: 'help'}], // 显示标题栏帮助按钮
    items: [
        {
            xtype: 'sm_tree',
            itemId: 's_page_tw_district_tree',
            width: 220,
            style: { borderRight: '1px solid #DDDDDD'},
            columns: [
                { xtype: 'treecolumn', text: '名称',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { xtype: 'actioncolumn', width: 50,
                    items: [{
                        iconCls: 'smart-action-btn smart-action-btn-add',
                        tooltip: '添加下级节点',
                        handler: function(view, rowIndex, colIndex, item, e, node, row) {
                            var parent = view.up('treepanel'),
                                rowedit = parent.getPlugin('treerowediting'),
                                values = parent.defaultValues;
                            // 叶节点要添加下一级，必须设置expand＝true
                            // 如果已经是父节点，千万不可再次设置expand＝true，否则expand()将不可展开子节点
                            if (!node.hasChildNodes()) node.set('expanded',true);
                            values.leaf = false;
                            var n = node.appendChild(values);
                            // 节点未展开时，执行节点展开
                            if (!node.isExpanded()) node.expand();
                            // 确保父节点是展开的，才可以显示行编辑
                            rowedit.startEdit(n, 0);
                        }
                    },
                    {
                        iconCls: 'smart-action-btn smart-action-btn-del',
                        tooltip: '删除当前节点',
                        handler: function(view, rowIndex, colIndex, item, e, node, row) {
                            if (node.hasChildNodes()) {
                                sTop('当前记录包含下级内容,不可直接删除。');
                                return;
                            }
                            Ext.MessageBox.confirm('确认', '确定要删除【<span class=s_red>'+node.get('name')+'</span>】么？', function(btn) {
                                if (btn == 'yes') {
                                    node.destroy();
                                }
                            });
                        },
                        isDisabled: function(view, rowIndex, colIndex, item, node) {
                            // 如果节点为root，则不能删除
                            // 第一行不可删除
                            if (rowIndex < 1) {
                                return true;
                            }else{
                                return false;
                            }
                        }
                    }]
                }
            ],
            store: 'tw.District',
            listeners: {
                select: function(tree, record, index, e){
                    var me = this,
                        parent = me.up('sm_tw_district'),
                        form = parent.down('#sm_tw_district_detail_form'),
                        did = record.getId();
                    if (did >= 0) {
                        var photo = this.up('sm_tw_district').down('sm_photoview');
                        photo.setQueryParam({'district':did, 'pclass':'QH'});
                        
                        // 读取
                        var District = Ext.ModelManager.getModel('Smart.model.tw.DistrictDetail');
                        District.load(did, {
                            success: function(record) {
                                record.set('content',Ext.String.htmlDecode(record.get('content')));
                                form.loadRecord(record);
                            }
                        });
                    }
                }
            }
        },
        {xtype: 'splitter'},
        // 中部面板
        {
            xtype: 'form',
            itemId: 'sm_tw_district_detail_form',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '10 0 0 0',
            items: [{
                    xtype: 'sm_mapfield',
                    name: 'latlng',
                    fieldLabel: '定位坐标'
                },{
                    xtype: 'sm_editor',
                    name: 'content',
                    flex: 1
                }
            ],
            bbar: ['->',{
                text: '保存',
                glyph: 'xe020',
                handler: function(btn) {
                    var parent = btn.up('sm_tw_district'),
                        form = parent.down('#sm_tw_district_detail_form').getForm(),
                        latlng = form.findField('latlng'),
                        content = form.findField('content'),
                        record = form.getRecord();
                    
                    record.set('latlng', latlng.getValue());
                    record.set('content', Ext.String.htmlEncode(content.getValue()));
                    record.save();
                }
            }]
        },
        {xtype: 'splitter'},
        {
            xtype: 'sm_photoview',
            title: '图片集',
            itemId: 's_page_tw_district_photo',
            width: 260,
            split: true,
            collapsible: true,
            //collapsed: true,
            animCollapse: false,
            collapseMode: 'header',
            collapseDirection: 'left',
            style: { borderLeft: '1px solid #DDDDDD' },
            photoStore: 'tw.Photo'
        }
    ],
    listeners: {
        afterrender: function() {
            var me = this,
                photo = me.down('sm_photoview'),
                editor = me.down('sm_editor');
            photo.setEditor(editor);    // 设置photoview与editor的关联关系
        }
    }
});