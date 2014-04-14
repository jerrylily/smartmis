// model.config.PageGrid
// 系统设置-系统功能页列表
Ext.define('Smart.model.config.PageGrid', {
    extend: 'Ext.data.Model',
    fields: ['id', 'page', 'code', 'module'],
    proxy: {
        type: 'sm_rest',
        url : '/pagegrid/'
    }
});