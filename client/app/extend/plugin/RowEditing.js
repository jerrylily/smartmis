// 对RowEditing的扩展
Ext.define('Smart.extend.plugin.RowEditing', {
    extend: 'Ext.grid.plugin.RowEditing',
    alias: 'plugin.sm_rowediting',
    clicksToEdit: 2,
    errorSummary: false,    // 不显示错误汇总
    pluginId: 'rowediting',
    listeners: {
        edit: function(editor, context, e) {
            var store = context.store;
            if (store) {
                store.sync({
                    success: function(batch, opts){
                        // 行编辑成功后，更新子表格参数
                        var grid = this.grid,
                            childs = grid.getChilds(),
                            data = this.context.record.data;
                        grid.setChildsData(childs, data); // 设置子grid初始参数
                    },
                    failure: function(){
                        // PASS 系统已有处理 
                    },
                    scope: editor
                });   // 手动向服务器提交
            }
        },
        canceledit: function(editor, context, e) {
            var rec = context.record,
                store = context.store;
            // 如果是新添加行，取消时清空添加行
            if (rec.phantom && store) {
                store.remove(rec);
            }
        }
    }
});