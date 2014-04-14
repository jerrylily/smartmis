// model.tw.ArticleDetail
// 台湾自由行-文章内容管理
Ext.define('Smart.model.tw.ArticleDetail', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title', 'copyurl', 'content'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/article_detail/'
    }
});
