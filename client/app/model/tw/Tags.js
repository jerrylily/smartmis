// model.tw.Tags
// 台湾自由行-Tags管理
Ext.define('Smart.model.tw.Tags', {
    extend: 'Ext.data.Model',
    fields: ['id', 'tag', {name:'hot', defaultValue:0}],
    proxy: {
        type: 'sm_rest',
        url : '/tw/tags/'
    }
});
