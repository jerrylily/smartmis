// model.setup.Organize
// 管理中心-单位部门
Ext.define('Smart.model.setup.Organize', {
    extend: 'Ext.data.Model',
    fields: ['id', 'division', 'name', 'parentId', 'address', 'phone'],
    proxy: {
        type: 'sm_rest',
        url : '/organize/',
        reader: {
            type: 'json',
            root: 'children'
        }
    }
});
