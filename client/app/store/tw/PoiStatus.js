// store.tw.PoiStatus
// 台湾自由行-兴趣点状态
Ext.define('Smart.store.tw.PoiStatus', {
    extend: 'Ext.data.ArrayStore',
    fields: ['name','value'],
    data: [
        ['待处理', '0'],
        ['待校对', '1'],
        ['待插图', '2'],
        ['完毕', '9']
    ]
});