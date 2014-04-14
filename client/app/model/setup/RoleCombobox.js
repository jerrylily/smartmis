// model.setup.RoleCombobox
// 管理中心-角色下拉列表
Ext.define('Smart.model.setup.RoleCombobox', {
    extend: 'Ext.data.Model',
    fields: ['value', 'text'],
    proxy: {
        type: 'sm_rest',
        url : '/rolelist'
    }
});
