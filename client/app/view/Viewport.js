Ext.define('Smart.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Fit',
        //'Smart.view.Test'
        'Smart.view.Main'
    ],

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'sm_main'
        //xtype: 'sm_test'
    }]
});
