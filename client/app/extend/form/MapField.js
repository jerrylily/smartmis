// extend.form.MapField
/* 
    从map中获取经纬度坐标
*/
Ext.define('Smart.extend.form.MapField', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.sm_mapfield',
    requires: [
        'Smart.extend.ux.GMap'
    ],
    //pickerOffset: [ 0, -20 ],
    triggerCls: Ext.baseCSSPrefix + 'form-map-trigger',  // 定位按钮
    editable: false,

    applyValues: function() {
        var me = this,
            map = me.picker.down('sm_gmappanel'),
            marker = map.getMarker(),   // map上有唯一的mark点
            l = marker.getPosition();
            console.log(l);
            val = l.lat()+','+l.lng();
        me.setValue(val);
        me.fireEvent( 'blur' );
        me.collapse();
    },
    
    createPicker: function() {
        var me = this,
            format = Ext.String.format;
        if (typeof mapWin == 'undefined') {
            mapWin = Ext.create('Ext.window.Window', {
                title: '浏览地图',
                closeAction: 'hide',
                width:400,
                height:350,
                resizable: false,
                layout: 'fit',
                items: [
                    {
                        xtype: 'sm_gmappanel',
                        center: {
                            // 台北市坐标
                            lat: 25.106,
                            lng: 121.559
                        }
                    }
                ],
                bbar:['->',
                    {
                        text:'确定',
                        glyph: 'xe005',
                        handler: function( btn, e, opts ) {
                            me.applyValues();
                        }
                    }
                ],
                listeners: {
                    //afterrender: function( win, opts ) {
                    show: function(win, e) {
                        var map = me.picker.down('sm_gmappanel'),
                            val = me.getValue();
                        map.initMarker(val);    // 设置显示地图时的初始marker点位
                    }
                }
            })
        }
        return mapWin;
    }
});