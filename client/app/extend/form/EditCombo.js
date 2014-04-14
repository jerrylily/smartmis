// extend.form.EditCombo
/* 
    可进行添加和删除选择项的下拉列表组件
    @ 删除：选中某项，或输入项与下拉项匹配时，显示【删除】按钮，点击删除按钮进行删除操作
    @ 添加：输入项无法与下拉项匹配时，会显示【添加】按钮，点添加按钮进行添加操作
*/

Ext.define('Smart.extend.form.EditCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.sm_editcombo',
    trigger1Cls: Ext.baseCSSPrefix + 'form-edit-trigger',  // 编辑按钮
    trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',  // 删除按钮
    trigger3Cls: Ext.baseCSSPrefix + 'form-add-trigger',    // 添加按钮
    trigger4Cls: Ext.baseCSSPrefix + 'form-trigger',    // 
    enableKeyEvents: true,
    forceSelection: true,
    autoSelect: true,
    queryMode: 'remote',
    //queryCaching: false, // 为true时，每次点击下拉列表都会查询数据库
    config: {
        editable: false
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        me.on('change', function(combo, newValue, oldValue, e){
            if (me.editable) {
                if (me.findRecordByDisplay(me.getRawValue())) {
                    // 输入的值为下拉列表中的值，显示删除按钮
                    me.triggerCell.item(0).setDisplayed(true);  // 编辑
                    me.triggerCell.item(1).setDisplayed(true);  // 删除
                    me.triggerCell.item(2).setDisplayed(false); // 添加
                }else{
                    // 输入的值为新增的值，显示添加按钮
                    me.triggerCell.item(0).setDisplayed(false);
                    me.triggerCell.item(1).setDisplayed(false);
                    if (me.getRawValue() == '') {
                        // 如果输入值为空，什么按钮都不显示
                        me.triggerCell.item(2).setDisplayed(false);
                    }else{
                        me.triggerCell.item(2).setDisplayed(true);
                    }
                }
                me.updateLayout();
            }
        });
        me.on('focus', function(combo, The, eOpts){
            if (me.editable) {
                // 点击点为空值时，不显示添加和删除按钮
                if (Ext.isEmpty(me.getValue())) {
                    me.triggerCell.item(0).setDisplayed(false);
                    me.triggerCell.item(1).setDisplayed(false);
                    me.triggerCell.item(2).setDisplayed(false);
                    
                } else {
                    me.triggerCell.item(0).setDisplayed(true);
                    me.triggerCell.item(1).setDisplayed(true);
                    me.triggerCell.item(2).setDisplayed(false);
                }
                me.updateLayout();
            }
        });
    },

    afterRender: function(){
        var me = this;
        me.callParent();
        me.triggerCell.item(0).setDisplayed(false);
        me.triggerCell.item(1).setDisplayed(false);
        me.triggerCell.item(2).setDisplayed(false);
    },
    // 编辑按钮事件
    onTrigger1Click : function(){
        var me = this,
            name = me.getRawValue(),
            record = me.findRecordByDisplay(name);
        Ext.MessageBox.prompt('修改条目', '当前条目【<span class=s_red>'+ name +'</span>】, 修改后的条目：', 
            function(btn, value) {
                console.log(btn);
                if (btn == 'ok') {
                    record.set(me.displayField,value);
                    me.setValue(value);
                }
            }, me,  // scope
            false,  // multi
            name    // value
        );
    },
    // 删除按钮事件
    onTrigger2Click : function(){
        var me = this,
            store = me.getStore(),
            name = me.getRawValue(),
            record = me.findRecordByDisplay(name);
        Ext.MessageBox.confirm('确认', '您确定要将条目【<span class=s_red>'+ name +'</span>】从下拉列表中删除么？<br /><span class=s_red>注意：删除是永久性的，不可再恢复！</span>', function(btn) {
            if (btn == 'yes') {
                //record.destroy();
                store.remove(record);
                me.setValue('');
                // 隐藏删除按钮
                me.triggerCell.item(0).setDisplayed(false);
                me.triggerCell.item(1).setDisplayed(false);
                me.updateLayout();
            }
        });
    },
    // 添加按钮事件
    onTrigger3Click : function(){
        var me = this,
            name = me.getRawValue(),
            store = me.getStore();
        Ext.MessageBox.confirm('确认', '您确定要将【<span class=s_red>'+ name +'</span>】加入到下拉列表的条目中么？<br /><span class=s_red>提示：添加成功后，可以在下拉列表中直接显示本记录！</span>', function(btn) {
            if (btn == 'yes') {
                var item = {};
                item[me.displayField] = name;
                store.add(item);
                // 隐藏添加按钮
                me.triggerCell.item(2).setDisplayed(false);
                me.updateLayout();
            }
        });
    },
    // 显示下拉内容事件按钮
    onTrigger4Click : function(){
        var me = this;
        me.onTriggerClick();
    }
});