// model.tw.Article_poi
// 台湾自由行-文章与兴趣点关联管理
Ext.define('Smart.model.tw.Article_poi', {
    extend: 'Ext.data.Model',
    fields: ['id', 'article', 'poi', 'poiname'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/article_poi/'
    }
});
