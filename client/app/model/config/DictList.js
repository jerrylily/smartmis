// model.config.DictList
// 系统设置-字典项
Ext.define('Smart.model.config.DictList', {
    extend: 'Ext.data.Model',
    fields: ['id', 'dicttype', 'key', 'value', 'order'],
    proxy: {
        type: 'sm_rest',
        url : '/dictlist/'
    }
});