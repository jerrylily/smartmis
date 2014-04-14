// extend.form.Tag
/* 
    Tag元素，显示在搜索框左侧的Tag列表元素
    # 根据tabpanel顶部的tab修改样式得到
    # 可以显示已选定的tag值
    # 可以存储tag值对应的key
*/
Ext.define('Smart.extend.form.Tag', {
    extend: 'Ext.tab.Tab',
    alias: 'widget.sm_tag',
    ui: 'tag',          // 指定tab使用四角都为圆形样式
    margin: '0 2 0 0 ',
    padding: '4 5 4 5',
    config: {
        parent: null,   // tag的父集合 tag_list
        tagUrl: null,   // tag关联管理url
        model:  null,   // 关联Model eg: article - a ; poi - p
        mid:    0,      // 关联Model的id
        tid:    0,      // tag的id
        tag:    ''      // tag
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        me.on('click', me.onClickClose);
    },
    // function
    // 设置tag显示值
    applyTag: function(value) {
        if(value){
            this.setText(value);
        }
        //console.log(this);
        return value;
    },
    // 关闭删除处理
    onClickClose: function(tab, e) {
        var me = this,
            tagId = e.target.id;
        
        // target 为鼠标点击的元素, tagId为被点击元素的id
        // tagId 里包含close的为tag上的关闭小按钮
        if (tagId.indexOf('close') > 0) {
            // ajax取消关联关系
            Ext.Ajax.request({
                url: me.tagUrl,
                params: {
                    op:     'remove',
                    model:  me.model,
                    mid:    me.mid,
                    tid:    me.tid
                },
                success: function(response){
                    console.log(response);
                    me.parent.remove(me, true);
                }
            });
        }
    }
});