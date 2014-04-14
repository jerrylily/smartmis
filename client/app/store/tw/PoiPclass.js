// store.tw.PoiPclass
// 台湾自由行-兴趣点类Pclass
Ext.define('Smart.store.tw.PoiPclass', {
    extend: 'Ext.data.ArrayStore',
    fields: ['name','value'],
    data: [
        ['景点', 'JD'],
        ['酒店', 'ZSJD'], // 住宿酒店  
        ['民宿', 'ZSMS'], // 住宿民宿
        ['餐饮', 'CY'],
        ['购物', 'GW'],
        ['娱乐', 'YL'],
        ['学校', 'XX'],
        ['交通', 'JT']
    ]
});