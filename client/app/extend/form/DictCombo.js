// extend.form.DictCombo
/*
    字典类下拉列表
    @ 自定义参数：dtype - 字典类型
*/
Ext.define('Smart.extend.form.DictCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.sm_dictcombo',
    //forceSelection: true,
    autoSelect: true,
    queryMode: 'remote',
    //queryCaching: false, // 为false时，每次点击下拉列表都会查询数据库
    config: {
        dtype: ''   // 字典类型
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
        var dictstore = Ext.create('Ext.data.Store', {
            fields: ['value', 'text'],
            proxy: {
                type: 'sm_rest',
                url: '/dictcombo/',
                extraParams: {dtype: me.dtype}
            },
            autoLoad: true
        });
        me.bindStore(dictstore);
    }
});