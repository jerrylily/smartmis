// model.tw.PoiCombobox
// 小工具-POI下拉列表
Ext.define('Smart.model.tw.PoiCombobox', {
    extend: 'Ext.data.Model',
    fields: ['value', 'text'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/poilist'
    }
});
