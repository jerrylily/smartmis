// view.widget.GMap
/* 
    谷歌地图
 * @author Jerry Liu
 */
Ext.define('Smart.extend.ux.GMap', {
    extend: 'Ext.ux.GMapPanel',
    alias: 'widget.sm_gmappanel',
    // 自定义参数
    config: {
        marker: null
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
        me.marker = new google.maps.Marker({
            draggable: true,
            optimized: true
        });
    },
    afterComponentLayout: function(){
        
        this.callParent();
        var me = this,
            map = me.gmap;
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        google.maps.event.addListener(map, 'click', function(e) {
            var l = e.latLng;
            me.marker.setPosition(l);
            me.marker.setMap(map);
            map.setCenter(l);
        });
    },
    // public function
    // l格式:  'lat,lng'
    // 设置显示地图时的初始marker点位
    initMarker: function(l) {
        var me = this,
            map = me.gmap,
            ls = l.split(',');
        if (ls.length == 2) {
            var latlng = new google.maps.LatLng(ls[0],ls[1]);
            me.marker.setPosition(latlng);
            me.marker.setMap(map);
            map.setCenter(latlng);
        }
    }
});