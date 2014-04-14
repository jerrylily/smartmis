// model.config.DictType
// 系统设置-字典分类
Ext.define('Smart.model.config.DictType', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'memo'],
    proxy: {
        type: 'sm_rest',
        url : '/dicttype/'
    }
});