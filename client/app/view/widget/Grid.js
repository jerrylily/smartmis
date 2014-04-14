// view.widget.Grid
/* 
    定制Grid,包含的特性：
    @添加、修改、删除（rowedit）
    @分页
    @父子关系Grid
*/
Ext.define('Smart.view.widget.Grid', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.sm_grid',
    requires: [
        'Smart.extend.plugin.RowEditing',
        'Smart.extend.form.SearchField',
        'Smart.extend.toolbar.Paging'
    ],
    //columnLines: true,
    config: {
        // 是否可编辑(true 将显示 添加、编辑、删除按钮)
        editable: true,
        // 父grid相关参数
        parent: null, //{itemId:'', linkField:'', value: -1},
        // 所含子grid相关参数
        childs: null, //[{itemId:'', linkField:'', titleField:''}]
        // 是否显示查询框
        searchable: false,
        // 是否自动加载数据
        autoLoadStore: true,
        // 是否显示分页
        pageable: true
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.on('afterrender', me.onAfterRender);
        me.on('beforeselect', me.onBeforeSelect);
        this.callParent(arguments);
    },
    selType: 'rowmodel', // 整行选择模式
    tools:[{type: 'help'}], // 显示标题栏帮助按钮
    plugins: [{ptype: 'sm_rowediting'}], // 行编辑模式
    tbar:[{
        itemId: 's_grid_btn_add',
        text: '添加',
        glyph: 'xe002',
        disabled: true,
        handler: function(btn, e) {
            //console.log('add');
            var parent = btn.up('grid');
            if (parent && parent.getStore()) {
                var recs = parent.getSelectionModel().getSelection(),
                    store = parent.getStore(),
                    model = store.getProxy().getModel(),
                    rowedit = parent.getPlugin('rowediting');
                store.insert(0, new model());
                if (rowedit) rowedit.startEdit(0, 0);
            }
        }
    },
    {
        itemId: 's_grid_btn_edit',
        text: '编辑',
        glyph: 'xe003',
        disabled: true,
        handler: function(btn, e) {
            var parent = btn.up('grid');
            if (parent && parent.getStore()) {
                var position = parent.getSelectionModel().getCurrentPosition(),
                    rowedit = parent.getPlugin('rowediting');
                if (rowedit && position) rowedit.startEdit(position.row, position.column);
            }
        }
    },
    {
        itemId: 's_grid_btn_del',
        text: '删除',
        glyph: 'xe004',
        disabled: true,
        handler: function(btn, e) {
            var parent = btn.up('grid');
            if (parent && parent.getStore()) {
                var recs = parent.getSelectionModel().getSelection(),
                    position = parent.getSelectionModel().getCurrentPosition(),
                    store = parent.getStore();
                if (position) {
                    Ext.MessageBox.confirm('确认', '确定要删除当前记录？', function(btn) {
                        if (btn == 'yes') {
                            store.remove(recs);
                            store.sync({
                                success: function(){
                                    // 确认删除将清空子grid的数据
                                    this.clearChildsData();
                                },
                                failure: function(){
                                    // 失败后恢复原记录
                                    this.getStore().rejectChanges();
                                },
                                scope: parent
                            });
                        }
                    });
                }
            }
        }
    },'->',
    {
        xtype: 'sm_searchfield',
        itemId: 's_grid_search',
        width: 150,
        hidden: true
    }],
    bbar: {
        xtype: 'sm_paging',
        hidden: true
    },
    ////////////////////////////////////////////////////////////
    // function
    ////////////////////////////////////////////////////////////
    // Event 事件处理函数
    onAfterRender: function(grid, e) {
        var store = grid.getStore(),
            pg = grid.down('pagingtoolbar'),
            search = grid.down('sm_searchfield'),
            rowedit = grid.getPlugin('rowediting'),
            btn_add = grid.down('#s_grid_btn_add'),
            btn_edit = grid.down('#s_grid_btn_edit'),
            btn_del = grid.down('#s_grid_btn_del');
        if (grid.pageable) {
            // 绑定表格与分页组件的store
            pg.setVisible(true);
            pg.bindStore(store);
        }
        // 显示搜索框
        if (grid.searchable) {
            search.show();
            search.store = store;
        }
        // 不可编辑状态将禁止行编辑
        if (!grid.editable) {
            //grid.down('toolbar').hide();
            btn_add.hide();
            btn_edit.hide();
            btn_del.hide();
            rowedit.removeManagedListener(rowedit.view, 'celldblclick');
        }
        // 是否自动加载数据
        if (grid.autoLoadStore) {
            btn_add.setDisabled(false);
            store.load();
        }else{
            btn_add.setDisabled(true);
        }
        // 重置子表格初始数据
        grid.clearChildsData();
    },
    onBeforeSelect: function(rs, record, index, e) {
        var grid = this,
            btn_edit = grid.down('#s_grid_btn_edit'),
            btn_del = grid.down('#s_grid_btn_del'),
            childs = grid.getChilds();
        // 有数据选中时，将编辑和删除按钮设置为活动状态
        //console.log('brforeselect');
        if (grid.editable) {
            btn_edit.setDisabled(false);
            btn_del.setDisabled(false);
        }
        // 父表格有效id才查询
        if (record.data.id > 0) {
            grid.setChildsData(childs, record.data); // 设置子grid初始参数
        }
    },
    /*  
        设置子表格初始数据
        @ childs  子表格列表
        @ data 数据格式{id:0, name:'xxx'}
    */ 
    setChildsData: function(childs, data) {
        var grid = this;
        // 包含指定子grid时执行如下操作:
        // 1. 传递父表格当前选中行的id
        // 2. 设定子表格关联字段的默认值
        // 3. 设置子表格标题
        Ext.Array.each(childs, function(item, index, countriesItSelf) {
            var child = grid.up('panel').down('#'+item.itemId),
                store = child.getStore(),
                proxy = store.getProxy(),
                model = proxy.getModel(),
                fields = model.getFields(),
                btn_add = child.down('#s_grid_btn_add'),
                btn_edit = child.down('#s_grid_btn_edit'),
                btn_del = child.down('#s_grid_btn_del'),
                mid = data.id ? data.id : 0,
                moduleField = Ext.Array.findBy(fields, function(field, index){return (field.name == item.linkField);}); // 查找关联field
            proxy.extraParams[item.linkField] = mid; // 设置子表格关联字段默认值
            moduleField.defaultValue = mid;  // 设置当前module的默认值为mid，post和put时，会自动提交
            var title = '';
            if (mid > 0) {
                title = data[item.titleField ? item.titleField : 'name']
            } 
            
            child.setTitle(child.title.replace(/\[.*\]-(.+)/, '['+ Ext.String.ellipsis(title,5) +']-$1'));    // 设置标题
            child.parent.value = mid;   // 设置当前子表格对应父表格id
            child.callChildFunc();      // 调用子表格callback函数
            
            // 可编辑状态下进行
            if (child.editable) {
                if (mid >0) {
                    btn_add.setDisabled(false);
                } else {
                    btn_add.setDisabled(true);
                }
                btn_edit.setDisabled(true);
                btn_del.setDisabled(true);
            }
            
            store.load();
        });
    },
    // 清除子表格初始数据
    clearChildsData: function() {
        var grid = this,
            childs = grid.getChilds(),
            btn_add = grid.down('#s_grid_btn_add'),
            btn_edit = grid.down('#s_grid_btn_edit'),
            btn_del = grid.down('#s_grid_btn_del');
        if (grid.editable) {
            btn_edit.setDisabled(true);
            btn_del.setDisabled(true);
        }
        grid.setChildsData(childs, {id:0});
    },
    // 子表格CallBack
    callChildFunc: function() {
        //pass
    },
    // 设置添加按钮是否可用
    setBtnAddEnable: function(enable) {
        var grid = this,
            btn_add = grid.down('#s_grid_btn_add');
        btn_add.setDisabled(!enable);
    }
});