// model.config.Division
// 系统设置-单位设置
Ext.define('Smart.model.config.Division', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'code', 'domain'],
    proxy: {
        type: 'sm_rest',
        url : '/divisions/'
    }
});
