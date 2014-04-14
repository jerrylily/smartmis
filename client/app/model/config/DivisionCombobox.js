// model.config.DivisionCombobox
// 小工具-单位下拉列表
Ext.define('Smart.model.config.DivisionCombobox', {
    extend: 'Ext.data.Model',
    fields: ['value', 'text'],
    proxy: {
        type: 'sm_rest',
        url : '/divisionlist'
    }
});
