// model.tw.PoiDetail
// 台湾自由行-兴趣点内容管理
Ext.define('Smart.model.tw.PoiDetail', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title', 'latlng', 'content', 'contentBak'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/poi_detail/'
    }
});
