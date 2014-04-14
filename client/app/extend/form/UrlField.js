// extend.form.UrlField
/* 
    Url,可以验证输入的url地址，可以点击图标打开url
*/
Ext.define('Smart.extend.form.UrlField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.sm_urlfield',
    vtype: 'url',
    triggerCls: Ext.baseCSSPrefix + 'form-url-trigger',
    // 重载trigger操作
    onTriggerClick : function(){
        var me = this,
            url = me.getValue();
        //console.log(me.getValue());
        window.open(url,'_blank');
    }
});