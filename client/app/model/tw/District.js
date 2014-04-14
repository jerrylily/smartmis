// model.tw.District
// 台湾自由行-行政区划
Ext.define('Smart.model.tw.District', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'parentId'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/district/',
        reader: {
            type: 'json',
            root: 'children'
        }
    }
});
