// model.tw.Article
// 台湾自由行-文章管理
Ext.define('Smart.model.tw.Article', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title', 'district', 'pclass', {name:'weight', defaultValue:0}, 'status'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/article/'
    }
});
