// 主页面
Ext.define('Smart.view.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.sm_main',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'Ext.layout.container.Accordion',
        'Ext.view.View'
    ],
    layout: {
        type: 'border',
        padding: '0 5 5 5'
    },

    items: [{
        itemId: 's_tl',
        region: 'north',
        xtype: 'toolbar',
        padding: 0,
        height: 50,
        items: [
            {
                itemId: 's_tlbtn_home',
                scale: 'large',
                ui: 'plain',
                glyph: 'xe000'
            },
            '->',
            {
                itemId: 's_tlbtn_logout',
                scale: 'large',
                ui: 'plain',
                glyph: 'xe001'
            }
        ]
    },{
        itemId: 's_nav',
        region: 'west',
        xtype: 'panel',
        title: '导航栏',
        width: 150,
        split: true,
        border: false,
        //tools:[{ type: 'refresh'}],
        collapsible: true,
        //collapsed: true,
        animCollapse: false,
        collapseMode: 'header',
        collapseDirection: 'left',
        layout: 'accordion'
    },{
        itemId: 's_tab',
        region: 'center',
        xtype: 'tabpanel',
        border: false
    }]
});