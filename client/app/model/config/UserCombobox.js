// model.config.UserCombobox
// 小工具-用户下拉列表
Ext.define('Smart.model.config.UserCombobox', {
    extend: 'Ext.data.Model',
    fields: ['value', 'text'],
    proxy: {
        type: 'sm_rest',
        url : '/userlist'
    }
});
