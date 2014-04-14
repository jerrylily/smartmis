// 主页面
Ext.define('Smart.view.Test', {
    extend: 'Ext.container.Container',
    alias: 'widget.sm_test',
    requires:[
        'Smart.extend.ux.AMap'
    ],
    //width: 300,
    layout: 'fit',
    margin: '50 50 50 50',
    items: [{
        xtype: 'sm_amappanel',
        center: {
            // 台北市坐标
            lat: 25.106,
            lng: 121.559
        }
    }]
});