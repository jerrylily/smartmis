// view.widget.ComboGrid
/* 
    顶部带下拉选框的列表Grid,包含的特性：
    @可以根据字段筛选结果的combobox
    @可以删除已关联的字段
    @应用场景，与特定表多对多关联的表
*/
Ext.define('Smart.view.widget.ComboGrid', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.sm_combogrid',
    config: {
        parent: null,       // 父grid相关参数 //{itemId:'', linkField:'', value: -1},
        comboStore: null,   // 下拉列表的store
        listField: null     // 列表关联字段 
    },
    //columnLines: true,
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.on('afterrender', me.onAfterRender);
        me.on('select', me.onGridSelect);
        this.callParent(arguments);
    },
    tools:[{type: 'help'}], // 显示标题栏帮助按钮
    tbar: [{
        xtype: 'combo',
        itemId: 's_page_widget_combogrid_combo',
        fieldLabel: '选择',
        labelWidth: 40,
        width: 160,
        forceSelection: true,
        queryMode: 'remote',
        queryCaching: false,
        valueField: 'value',
        displayField: 'text',
        disabled: true,
        listeners: {
            select: function(combo, records, e) {
                var parent = combo.up('grid'),
                    btn_add = parent.down('#s_page_widget_combogrid_btn_add');
                if (records.length == 1) {
                    btn_add.setDisabled(false);
                }
            }
        }
    },{
        itemId: 's_page_widget_combogrid_btn_add',
        //text: '添加',
        glyph: 'xe002',
        disabled: true,
        handler: function(btn, e) {
            var parent = btn.up('grid'),
                store = parent.getStore(),
                model = store.getProxy().getModel(),
                comb = parent.down('#s_page_widget_combogrid_combo');
            if (parent.parent.value = 0) {
                return;
            }
            if (comb.value && store.find(parent.listField, comb.value) == -1) {
                //console.log(comb.value);
                var v = new model();
                v.set(parent.listField, comb.value)
                store.insert(0, v);
                store.sync();
            }
            comb.reset();
        }
    },'->',{
        itemId: 's_page_widget_combogrid_btn_del',
        //text: '删除',
        glyph: 'xe004',
        disabled: true,
        handler: function(btn, e) {
            var parent = btn.up('grid');
            if (parent && parent.getStore()) {
                var recs = parent.getSelectionModel().getSelection(),
                    position = parent.getSelectionModel().getCurrentPosition()
                    store = parent.getStore();
                if (position) {
                    Ext.MessageBox.confirm('确认', '确定要删除当前记录？', function(btn) {
                        if (btn == 'yes') {
                            store.remove(recs);
                            store.sync({
                                success: function(){
                                    // pass
                                },
                                failure: function(){
                                    // 失败后恢复原记录
                                    this.getStore().rejectChanges();
                                },
                                scope: parent
                            });
                        }
                    });
                } // if (position)
            }// if (parent
        }//handler
    }],
    ////////////////////////////////////////////////////////////
    // function
    ////////////////////////////////////////////////////////////
    // grid render
    onAfterRender: function(grid, e) {
        var me = this,
            combo = me.down('#s_page_widget_combogrid_combo');
        combo.bindStore(me.comboStore);
        combo.queryParam = me.listField;
    },
    // grid select
    onGridSelect: function(rs, record, index, e) {
        var grid = this,
            btn_del = grid.down('#s_page_widget_combogrid_btn_del');
        btn_del.setDisabled(false);
    },
    
    // 回调函数
    // 子表格CallBack
    callChildFunc: function() {
        var grid = this,
            combo = grid.down('#s_page_widget_combogrid_combo'),
            btn_add = grid.down('#s_page_widget_combogrid_btn_add'),
            btn_del = grid.down('#s_page_widget_combogrid_btn_del');
        if (grid.parent.value > 0) {
            combo.setDisabled(false);
        } 
        else {
            combo.setDisabled(true);
            btn_add.setDisabled(true);
            btn_del.setDisabled(true);
        }
    }
});