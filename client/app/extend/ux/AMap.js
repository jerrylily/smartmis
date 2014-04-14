// view.widget.AMap
/* 
    高德地图
 * @author Jerry Liu
 */
Ext.define('Smart.extend.ux.AMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sm_amappanel',
    requires: ['Ext.window.MessageBox'],
    markIcon: 'http://webapi.amap.com/images/marker_sprite.png',    // 标记点图标
    
    initComponent : function(){
        Ext.applyIf(this,{
            plain: true,
            border: false
        });
        
        this.callParent();        
    },
    
    afterFirstLayout : function(){
        var center = this.center;
        this.callParent();       
        
        if (center) {
            if (center.geoCodeAddr) {
                this.lookupCode(center.geoCodeAddr, center.marker);
            } else {
                this.createMap(center);
            }
        } else {
            Ext.Error.raise('center is required');
        }
              
    },
    
    createMap: function(center, marker) {
        var options = Ext.apply({}, this.mapOptions);
        
        options = Ext.applyIf(options, {
            level: 14,
            center: center
        });
        console.log(options);
        console.log(this);
        // 创建高德地图实例
        this.amap = new AMap.Map(this.body.dom, options);
        //添加地图类型切换插件
        this.amap.plugin(["AMap.MapType"],function(){
            //地图类型切换
            type= new AMap.MapType({defaultType:0});    //初始状态使用2D地图
            this.amap.addControl(type);
        });
        
        if (marker) {
            this.addMarker(Ext.applyIf(marker, {
                position: center
            }));
        }
        
        Ext.each(this.markers, this.addMarker, this);
        this.fireEvent('mapready', this, this.amap);
    },
    
    addMarker: function(marker) {
        marker = Ext.apply({
            icon: this.markIcon,
            map: this.amap
        }, marker);
        
        if (!marker.position) {
            marker.position = new AMap.LngLat(marker.lat, marker.lng);
        }
        var o =  new AMap.Marker(marker);
        Ext.Object.each(marker.listeners, function(name, fn){
            AMap.event.addListener(o, name, fn);    
        });
        return o;
    },
    
    lookupCode : function(addr, marker) {
        this.amap.plugin(["AMap.Geocoder"])
        this.geocoder = new AMap.Geocoder();
        this.geocoder.geocode({
            address: addr
        }, Ext.Function.bind(this.onLookupComplete, this, [marker], true));
    },
    
    onLookupComplete: function(data, response, marker){
        if (response != 'OK') {
            Ext.MessageBox.alert('Error', 'An error occured: "' + response + '"');
            return;
        }
        this.createMap(data[0].geometry.location, marker);
    },
    
    afterComponentLayout : function(w, h){
        this.callParent(arguments);
        this.redraw();
    },
    
    redraw: function(){
        var map = this.amap;
        if (map) {
            AMap.event.trigger(map, 'resize');
        }
    }
 
});