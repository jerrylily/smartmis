// view.widget.PhotoView
/* 
    选择照片的dataview组件
    @可以根据类别及行政区划筛选显示相关图片缩略图
    @可以上传图片
    @可以删除图片
*/
Ext.define('Smart.view.widget.PhotoView', {
    extend: 'Ext.panel.Panel',
    cls: 'images-view',
    alias : 'widget.sm_photoview',
    requires: [
        'Ext.form.field.Hidden',
        'Ext.form.field.File',
        'Ext.ux.DataView.LabelEditor',
        'Smart.extend.form.CsrfField'
    ],
    config: {
        photoStore: null,   // 照片store
        queryParam: null,   // 查询参数 eg: {pclass: 'JD', district: 3}
        editor: null        // 编辑器
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.on('afterrender', me.onAfterRender);
        me.callParent(arguments);
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'dataview',
            flex: 1,
            style: { border: '1px solid #DDDDDD' },
            margin: '0 8 0 8',
            plugins: [
                Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'title'})
            ],
            tpl: [
                '<tpl for=".">',
                    '<div class="thumb-wrap" id="{name:stripTags}">',
                        '<div class="thumb"><img src="media/{photo_100}" title="{title:htmlEncode}"></div>',
                        '<span class="x-editable">{title:htmlEncode}</span>',
                    '</div>',
                '</tpl>',
                '<div class="x-clear"></div>'
            ],
            trackOver: true,
            overItemCls: 'x-item-over',
            itemSelector: 'div.thumb-wrap',
            listeners: {
                // 双击图片插入编辑器的光标处
                itemdblclick: function(view, record, item, index, e, eOpts) {
                    var editor = view.up('sm_photoview').getEditor(),
                        text = '<a href="media/'+record.get('photo_1000')+'" target="_blank"><img src="media/'+record.get('photo_500')+'"></a>';
                    if (editor) editor.insertAtCursor(text);
                }
            }
        }
    ],
    tools: [{
        type: 'search',
        callback: function (panel) {
            var search = panel.down('#s_photo_search');
            if (search.isHidden()) {
                search.show();
            }else{
                search.hide();
            }
        }
    }],
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 's_photo_search',
        hidden: true,
        dock: 'top',
        layout: 'hbox',
        items: [{
            xtype: 'sm_searchfield',
            flex: 1
        }]
    },{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'form',
            layout: 'hbox',
            url: '/tw/photo/',
            items:[
                {xtype: 'sm_csrffield'},    // 必须字段 csrf token
                {
                    xtype: 'hiddenfield',
                    name: 'district'
                },{
                    xtype: 'hiddenfield',
                    name: 'pclass'
                },{
                    xtype: 'textfield',
                    name: 'title',
                    width: 120,
                    allowBlank: false,
                    emptyText: '图片标题'
                },
                {
                    xtype: 'filefield',
                    name: 'photo',
                    hideLabel: true,
                    allowBlank: false,
                    buttonOnly: true,
                    buttonText: '',
                    buttonConfig: {
                        //glyph: 'xe021'
                        text: '选择'
                    },
                    //margin: '0 5 0 5',
                    regex: /^.*\.(jpeg|JPEG|jpg|JPG|png|PNG|gif|GIF)$/,
                    regexText: '只允许使用jpg、png、gif格式',
                    listeners: {
                        'change': function(fb, v){
                            var title = fb.up('form').down('textfield'),
                                t = v.split('\\').pop(),
                                ts = t.split('.');
                            title.setValue(ts[0]);
                        }
                    }
                }
            ]
        },'->',{
            xtype: 'button',
            tooltip: '上传',
            text: '上传',
            //glyph: 'xe022',
            handler: function() {
                var me = this,
                    parent = me.up('sm_photoview');
                if (Ext.isEmpty(parent.queryParam)) return;
                
                var form = me.up('sm_photoview').down('form').getForm(),
                    photo = form.findField('photo'),
                    title = form.findField('title'),
                    store = me.up('sm_photoview').down('dataview').getStore();
                if (form.isValid()) {
                    form.submit({
                        success: function(form, action) {
                            photo.reset();
                            title.reset();
                            store.load();
                        },
                        failure: function(form, action) {
                            photo.reset();
                            title.reset();
                            sTop('上传失败,请稍后再试！');
                        }
                    });
                }
                else {
                    photo.reset();
                    title.reset();
                    sTop('只允许上传格式为jpg、png、gif的图片');
                }
                
            }
        }]
    }],
    bbar: {
        xtype: 'pagingtoolbar',
        store: 'tw.Photo',
        displayInfo: false,
        inputItemWidth: 30,
        afterPageText: '',
        beforePageText: ''
    },
    
    ////////////////////////////////////////////////////////////
    // function
    ////////////////////////////////////////////////////////////
    // apply
    applyQueryParam: function(value) {
        if (Ext.isEmpty(value)) return;
        var me = this,
            view = me.down('dataview'),
            search = me.down('sm_searchfield'),
            store = view.getStore(),
            proxy = store.getProxy(),
            form = me.down('form').getForm(),
            district = form.findField('district'),
            pclass = form.findField('pclass'),
            photo = form.findField('photo'),
            title = form.findField('title');
        // 设置hidden field 参数
        district.setValue(value.district);
        pclass.setValue(value.pclass);
        
        // 设置photo store 参数
        store.clearFilter(true);    // 清除之前的检索参数
        proxy.extraParams['pclass'] = value.pclass;
        proxy.extraParams['district'] = value.district;
        store.load();
        
        //search.reset();
        photo.reset();
        title.reset();
        search.setValue('');
        search.store = store;
        return value;
    },
    
    // grid render
    onAfterRender: function(panel, e) {
        var me = this,
            view = me.down('dataview');
        view.bindStore(me.photoStore);
    }
});