// model.config.Page
// 系统设置-系统功能页
Ext.define('Smart.model.config.Page', {
    extend: 'Ext.data.Model',
    fields: ['id', 'module', 'name', 'icon', 'glyph', 'code', 'is_top'],
    proxy: {
        type: 'sm_rest',
        url : '/pages/'
    }
});