// view.widget.EditTree
/* 
    可编辑Tree
    固定 displayField: name  , ddGroup: 'dd001'
    @ defaultValues: {}    // 添加节点时 默认的值
 * @author Jerry Liu
 */
Ext.define('Smart.view.widget.EditTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.sm_tree',
    requires: [
        'Ext.tree.plugin.TreeViewDragDrop',
        'Smart.extend.plugin.TreeRowediting'
    ],
    displayField: 'name',
    rootVisible: false,
    // 自定义参数
    config: {
        defaultValues: {}    // 添加节点时 默认的值
    },
    plugins: [{
        ptype: 'sm_treerowediting'  //// tree行编辑模式
    }],
    viewConfig: {
        plugins: [{
            ptype: 'treeviewdragdrop',
            ddGroup: 'dd001',
            displayField: 'name'
        }]
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.on('itemmove', me.onItemMove);
        me.callParent(arguments);
    },
    
    // function
    onItemMove: function(node, oldParent, newParent, index, e) {
        // 节点移动后提交保存记录
        node.save();
    }

});