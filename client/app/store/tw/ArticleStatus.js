// store.tw.ArticleStatus
// 台湾自由行-文章类状态
Ext.define('Smart.store.tw.ArticleStatus', {
    extend: 'Ext.data.ArrayStore',
    fields: ['name','value'],
    data: [
        ['待处理', '0'],
        ['待校对', '1'],
        ['待插图', '2'],
        ['完毕', '9']
    ]
});