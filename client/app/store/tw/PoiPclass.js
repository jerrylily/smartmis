// store.tw.PoiPclass
// 台湾自由行-兴趣点类Pclass
Ext.define('Smart.store.tw.PoiPclass', {
    extend: 'Ext.data.ArrayStore',
    fields: ['name','value'],
    data: [
        ['景点',       'JD'],
        ['- 旅游景点',  'JDLY'],
        ['- 老街景点',  'JDLJ'],
        ['- 馆区景点',  'JDGQ'],
        ['- 文化景点',  'JDWH'],
        ['- 主题景点',  'JDZT'],
        
        ['住宿',      'ZS'],
        ['- 酒店',    'ZSJD'],
        ['- 民宿',    'ZSMS'],
        
        ['餐饮',      'CY'],
        ['- 中餐厅',   'CYZC'],
        ['- 西餐厅',   'CYXC'],
        ['- 特色小吃', 'CYTS'],
        ['- 夜市小吃', 'CYYS'],
        ['- 夜宵',     'CYYX'],
        ['- 甜品',     'CYTP'],
        
        ['购物',       'GW'],
        ['- 商场',     'GWSC'],
        ['- 购店',     'GWSD'],
        ['- 地下街',   'GWDX'],
        ['- 市集',     'GWSJ'],
        
        ['娱乐',       'YL'],
        ['- 娱乐场所',  'YLCS'],
        ['- 儿童乐园',  'YLET'],
        
        ['学校', 'XX'],
        
        ['交通',      'JT'],
        ['- 捷运站',   'JTJY'],
        ['- 码头',     'JTMT'],
        ['- 火车站',   'JTHC'],
        ['- 机场',     'JTJC'],
        ['- 长途公车站', 'JTCT'],
        ['- 客运站',   'JTKY']
    ]
});