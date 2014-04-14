// extend.form.CsrfField
/*
    Django csrfmiddlewaretoken
*/
Ext.define('Smart.extend.form.CsrfField', {
    extend: 'Ext.form.Hidden',
    alias: 'widget.sm_csrffield',
    name: 'csrfmiddlewaretoken',
    value: Ext.util.Cookies.get('csrftoken')
});