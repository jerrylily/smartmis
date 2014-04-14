// view.setup.Organize
// 管理中心-组织架构管理页面
Ext.define('Smart.view.setup.Organize', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_setup_organize',
    requires: [
        'Smart.view.widget.EditTree',
        'Ext.grid.plugin.DragDrop',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.column.Action',
        'Smart.view.widget.Grid',
        'Smart.extend.toolbar.Paging'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    tools:[{type: 'help'}], // 显示标题栏帮助按钮
    items: [
        {
            xtype: 'sm_tree',
            title: '部门管理',
            itemId: 's_page_setup_organize_org',
            width: 600,
            style: { borderRight: '1px solid #DDDDDD'},
            viewConfig: {
                plugins: [{
                    ptype: 'treeviewdragdrop',
                    ddGroup: 'dd001',
                    displayField: 'name'
                }],
                listeners: {
                    beforedrop: function(node, data, overModel, dropPosition, dropHandlers, e) {
                        var stype = data.view.xtype,
                            records = data.records,
                            rec = records[0],
                            orgId = overModel.getId(), // overModel 为树节点
                            //msg = '确定要将选定的部门转移到当前部门之下么？';
                            msg = '确定要将【<span class=s_red>'+rec.get('name')+'</span>】转到部门【<span class=s_red>'+overModel.get('name')+'</span>】下么？';
                        dropHandlers.wait = true; // 暂停拖拽动作
                        // 提示语分析
                        if (stype == 'gridview') {
                            //msg = '确定要将【<span class=s_red>'+rec.get('name')+'</span>】转到部门【<span class=s_red>'+overModel.get('name')+'</span>】下么？';
                            if (orgId == 0) return false; // orgId = 0 为根节点，不允许加入到根节点
                        }
                        Ext.MessageBox.confirm('确认', msg, function(btn) {
                            if (btn == 'yes') {
                                if (stype == 'gridview') {
                                    // 当从用户列表drag数据时，数据不可直接加入tree，需要执行将用户加入改部门的操作
                                    dropHandlers.cancelDrop();
                                    rec.set('organize', orgId); // grid 设置为 autoSync ,不用手动save
                                    //console.log(overModel);
                                }else{
                                    dropHandlers.processDrop();
                                }
                            }else{
                                dropHandlers.cancelDrop();
                            }
                        });
                    }
                }
            },
            columns: [
                { xtype: 'treecolumn', text: '部门名称',  dataIndex: 'name', editor: { xtype: 'textfield', allowBlank: false }, width: 200 },
                { text: '联系电话', dataIndex: 'phone', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
                { text: '联系地址', dataIndex: 'address', editor: { xtype: 'textfield', allowBlank: false }, flex: 1 },
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
            store: 'setup.Organize',
            tbar: [{
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
                            var tree = combo.up('treepanel'),
                                ugrid = tree.up('sm_setup_organize').down('#s_page_setup_organize_userlist'),
                                store = tree.getStore(),
                                proxy = store.getProxy(),
                                ustore = ugrid.getStore(),
                                uproxy = ustore.getProxy(),
                                post_store = Ext.getStore('setup.PostCombobox'),
                                post_proxy = post_store.getProxy();
                            // 设置treepanel节点默认值
                            tree.setDefaultValues({'division':combo.getValue()});
                            // 加载部门树
                            proxy.extraParams['division'] = combo.getValue();
                            proxy.extraParams['dname'] = combo.getRawValue();
                            store.load();
                            // 加载所属单位人员
                            uproxy.extraParams['division'] = combo.getValue();
                            uproxy.extraParams['org'] = 0;  // org=0 显示全部人员
                            ustore.load();
                            // 职位下拉列表
                            post_proxy.extraParams['division'] = combo.getValue();
                            post_store.load();
                        }
                    }
                }
            }],
            listeners: {
                select: function(tree, record, index, e){
                    if (Ext.isEmpty(record.getId())) return false;  // 新添加的记录不触发select
                    var me = this,
                        path = [],
                        usergrid = me.up('sm_setup_organize').down('#s_page_setup_organize_userlist'),
                        store = usergrid.getStore(),
                        proxy = store.getProxy();
                    if (record.getId() == 0) {
                        path.push(0);
                    } else {
                        path = this.getChildSet(record);
                    }
                    proxy.extraParams['org'] = path.join(',');
                    store.load();
                }
            },
            // function
            // 递归获取下属所有节点集合
            getChildSet: function(node) {
                var path = [];
                if (!Ext.isEmpty(node.getId())) path.push(node.getId());
                node.eachChild(function(node){
                    path = path.concat(this.getChildSet(node));
                },this)
                return path;
            }
        },
        {xtype: 'splitter'},
        {
            xtype: 'grid',
            title: '用户基本信息管理',
            itemId: 's_page_setup_organize_userlist',
            flex: 1,
            style: { borderLeft: '1px solid #DDDDDD'},
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'dd001',
                    enableDrop: false,
                    dragText: '将该用户拖拽到左侧的部门上，即可完成所属部门的变更'
                }
            },
            selType: 'cellmodel',
            plugins: [{ptype: 'cellediting'}],
            columns: [
                {xtype: 'rownumberer'},
                { text: '员工', dataIndex: 'name', flex: 3 },
                { text: '部门',  dataIndex: 'orgname', flex: 2 },
                { text: '职位', dataIndex: 'post', flex: 3,
                    editor: { 
                        xtype: 'combo',
                        allowBlank: false ,
                        forceSelection: true,
                        autoSelect: true,
                        queryMode: 'remote',
                        valueField: 'name',
                        displayField: 'name',
                        store: 'setup.PostCombobox'
                    }
                },
                { text: '密级', dataIndex: 'level', flex: 1,
                    editor: { xtype: 'numberfield', allowBlank: false , Value:0, maxValue:10, minValue:0}
                }
                
            ],
            store: 'setup.Organize_users',
            tbar: [
                '职位管理:',
                {
                    xtype: 'sm_editcombo',
                    width: 150,
                    editable: true,
                    valueField: 'name',
                    displayField: 'name',
                    store: 'setup.PostCombobox'
                },
                '->',
                {
                    text: '无部门人员',
                    glyph: 'xe00f',
                    handler: function(btn, e) {
                        var grid = btn.up('#s_page_setup_organize_userlist'),
                            store = grid.getStore(),
                            proxy = store.getProxy();
                        proxy.extraParams['org'] = 'u';  // org=u 显示未分配部门人员
                        store.load();
                    }
                }
            ],
            bbar: {
                xtype: 'sm_paging',
                store: 'setup.Organize_users'
            }
        }
    ]
});