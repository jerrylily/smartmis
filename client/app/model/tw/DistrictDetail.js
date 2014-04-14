// model.tw.DistrictDetail
// 台湾自由行-行政区划内容细节
Ext.define('Smart.model.tw.DistrictDetail', {
    extend: 'Ext.data.Model',
    fields: ['id', 'latlng', 'content'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/district_detail/'
    }
});
