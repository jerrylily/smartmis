// 对RowEditing的扩展,专用于treegrid
Ext.define('Smart.extend.plugin.TreeRowediting', {
    extend: 'Ext.grid.plugin.RowEditing',
    alias: 'plugin.sm_treerowediting',
    clicksToEdit: 2,
    errorSummary: false,    // 不显示错误汇总
    pluginId: 'treerowediting',
    listeners: {
        beforeedit: function(editor, context, e) {
            var view = context.view,
                record = context.record;
            // treegrid的第一行不能编辑
            if (record.get('id') == 0) return false;
        },
        edit: function(editor, context, e) {
            var record = context.record;
            record.save({
                success: function(batch, opts){
                    /* tree节点保存后无法更新id，使得新添加的节点无法更新
                        需要从 opts.response.responseText 获取id值，手动更新节点ID
                    */
                    var results = Ext.decode(opts.response.responseText);
                    record.setId(results.id);   
                },
                failure: function(){
                    // PASS 系统已有处理 
                },
                scope: editor
            });
        },
        canceledit: function(editor, context, e) {
            var rec = context.record;
            // 如果是新添加行，取消时清空添加行
            if (rec.phantom) {
                rec.destroy();
            }
            
        }
    }
});