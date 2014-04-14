// System - 授权单位
Ext.define('Smart.model.config.System', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'code', 'num', 'limit', 'contact', 'phone', 'address', 'zipcode'],
    proxy: {
        type: 'sm_rest',
        url : '/systems/',
        writer: {
            type: 'sm_json'     // 允许提交hasmany数据
        }
    },
    hasMany: {model: 'config.Module', name: 'modules'}
});

