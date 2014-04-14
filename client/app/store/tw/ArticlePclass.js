// store.tw.ArticlePclass
// 台湾自由行-文章类Pclass
Ext.define('Smart.store.tw.ArticlePclass', {
    extend: 'Ext.data.ArrayStore',
    fields: ['name','value'],
    data: [
        ['商圈', 'SQ'],
        ['美食', 'MS'],
        ['特产', 'TC'],
        ['人物', 'RW'],
        ['教育', 'JY'],
        ['风俗', 'FS'],
        ['活动', 'HD'],
        ['攻略', 'GL'],
        ['行程', 'XC'],
        ['贴士', 'TS']
    ]
});