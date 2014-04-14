// model.setup.PostCombobox
// 管理中心-职位下拉列表
Ext.define('Smart.model.setup.PostCombobox', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name'],
    proxy: {
        type: 'sm_rest',
        url : '/post/'
    }
});
