Ext.define('Smart.Application', {
    name: 'Smart',

    extend: 'Ext.app.Application',

    views: [
        // TODO: add views here
    ],

    controllers: [
        'Smart.controller.Main',
        'Smart.controller.Config',
        'Smart.controller.Setup',
        'Smart.controller.Hd',
        'Smart.controller.Tw'
    ],

    stores: [
        // TODO: add stores here
    ],
    init: function() {
        // 设置glyph的字体为 smart
        Ext.setGlyphFontFamily('smart');
        // 设置json的日期格式为 'Y-m-d'
        Ext.JSON.encodeDate = function(d) {
            return Ext.Date.format(d, '"Y-m-d"');
        };
        
        // 设置全局CSRF
        Ext.require(["Ext.util.Cookies", "Ext.Ajax"], function(){
        var token = Ext.util.Cookies.get('csrftoken');
        if(!token){
            Ext.Error.raise("Missing csrftoken cookie");
        } else {
            Ext.Ajax.defaultHeaders = Ext.apply(Ext.Ajax.defaultHeaders || {}, {
                'X-CSRFToken': token
            });
            //console.log(Ext.Ajax.defaultHeaders);
        }
    });
    },
    launch: function() {
        //console.log('hello launch');
    }
});
