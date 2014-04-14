// view.widget.PageTree
/* 
    功能页列表树,包含的特性：
    @全部选中
    @全部取消选中
*/
Ext.define('Smart.view.widget.PageGrid', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.sm_pagegrid',
    requires: [
        'Ext.grid.feature.Grouping'
    ],
    //columnLines: true,
    config: {
        parent: null //parent: {itemId:'xxx', record: null}
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.on('afterrender', me.onAfterRender);
        this.callParent(arguments);
    },
    tools: [{type: 'help'}], // 显示标题栏帮助按钮
    viewConfig: {stripeRows: false},
    selType: 'checkboxmodel',
    features: [{
        ftype:'grouping',
        groupHeaderTpl: '{name} ({rows.length})',
        hideGroupedHeader: true
    }],
    columns: [
        { text: 'id', dataIndex: 'id', align: 'right', width: 50},
        { text: '名称',  dataIndex: 'page', flex: 1 },
        { text: '代码标识', dataIndex: 'code', flex: 1 }
    ],
    store: 'config.PageGrid',
    tbar:[{
        itemId: 's_pagegrid_btn_refresh',
        text: '刷新',
        iconCls: 'x-tbar-loading',
        handler: function(btn, e) {
            console.log('shua');
            var parent = btn.up('grid');
            if (parent && parent.getStore()) {
                parent.getStore().reload();
            }
        }
    },'->',
    {
        itemId: 's_pagegrid_btn_save',
        text: '保存',
        glyph: 'xe006',
        disabled: true,
        handler: function(btn, e) {
            var grid = btn.up('grid'),
                pages = [],
                selected = grid.getSelectionModel().getSelection(),
                record = grid.parent.record,
                store = record.store;
            selected.forEach(function(sel) {
                pages.push(sel.data.id);
            });
            record.set('page', pages);
            store.sync({
                success: function(){
                    //console.log(this);
                },
                failure: function(){
                    // 失败后回复原记录
                    this.parent.record.reject();
                },
                scope: grid
            });
        }
    }],
    ////////////////////////////////////////////////////////////
    // function
    ////////////////////////////////////////////////////////////
    // Event事件处理函数
    onAfterRender: function(grid, e) {
        var store = grid.getStore();
        store.load();
    },
    // 设置功能树显示值
    // record 为记录行引用
    setCheckedData: function(record) {
        var me = this,
            pages = me.getStore();
        me.getSelectionModel().deselectAll();
        if (record) {
            me.down('#s_pagegrid_btn_save').setDisabled(false);
            me.parent.record = record;
            record.data.page.forEach(function(pid) {
                me.getSelectionModel().select(pages.getById(pid), true); // true - 保留之前的选项
            });
        }
        
    },
    // 子表格CallBack
    callChildFunc: function() {
        //pass
    }
});