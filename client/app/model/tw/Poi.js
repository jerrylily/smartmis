// model.tw.Poi
// 台湾自由行-兴趣点管理
Ext.define('Smart.model.tw.Poi', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title', 'district', 'pclass', {name:'weight', defaultValue:0}, 'status'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/poi/'
    }
});
