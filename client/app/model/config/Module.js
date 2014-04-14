// model.config.Module
// 系统设置-系统功能模块
Ext.define('Smart.model.config.Module', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'glyph', 'code'],
    proxy: {
        type: 'sm_rest',
        url : '/modules/'
    }
});
