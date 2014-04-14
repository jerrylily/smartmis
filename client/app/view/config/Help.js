// view.config.Help
// 系统设置-帮助页面
Ext.define('Smart.view.config.Help', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_config_help',
    requires: [
        'Ext.layout.container.Column',
        'Smart.extend.form.SmartEditor',
        'Smart.view.widget.Avatar'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'panel',
            width: 250,
            tbar: [
                {
                    text: '头像',
                    handler: function() {
                        Ext.create('Ext.window.Window', {
                            title: "上传头像!",
                            width: 620,
                            height: 420,
                            resizable: false,
                            layout: 'fit',
                            items: {
                                xtype: 'sm_avatar'
                            }
                        }).show();
                        
                    }
                }
            ]
        },
        {
            xtype: 'sm_editor',
            flex: 1
        }
        /*
        {
            xtype: 'form',
            title: '帮助正文',
            flex: 1,
            //layout: 'anchor',
            items: [
                {
                    xtype: 'sm_ueditor',
                    //xtype: 'textarea',
                    itemId: 's_page_config_help_editor',
                    anchor: '100% 100%'
                }
            ]
        }
        */
    ]
});