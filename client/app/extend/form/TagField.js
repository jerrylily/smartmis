// extend.form.TagField
/* 
    Tag栏
    # 调用时需指定:
    # store: '' 
    # displayField
    # valueField
*/
Ext.define('Smart.extend.form.TagField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.sm_tagfield',
    requires: [
        'Smart.extend.form.Tag'
    ],
    layout: 'hbox',
    config: {
        store: null,
        displayField: 'tag',
        valueField: 'id',
        queryParam: 'tag',
        tagList: null,
        tagUrl: null,       // 关联tag的管理url
        ownerModel: null,   // 关联tag的源model: Article - a ; poi - p
        ownerId: 0          // 关联tag的源id
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.on('afterrender', me.onAfterRender);
        this.callParent(arguments);
    },
    items: [
        {
            xtype: 'fieldcontainer',
            itemId: 's_tab_tag_list',
            layout: 'hbox',
            items: []
        },
        {
            xtype: 'combo',
            minChars: 0,
            typeAhead: false,
            autoSelect: false,
            hideLabel: true,
            //hideTrigger:true,
            width: 100,
            listeners: {
                // 响应下拉列表某项被选中后的事件
                select: function(cb, recs, e){
                    var parent = cb.up('sm_tagfield'),
                        rec = recs[0],
                        tag = rec.get(cb.displayField),
                        tid = rec.get(cb.valueField);
                    if (Ext.isEmpty(tag)) return false;
                    
                    // taglist中不包含本tag,则将rec加入taglist
                    if (parent.checkTag(tag)) {
                        // 提交ajax请求
                        if (parent.tagUrl){
                            parent.addTag(tid, tag);    // 添加tag
                        }
                    }else{
                        sTop('您已经添加过标签【'+tag+'】');
                    }
                    
                    // 将选项清空
                    cb.reset();
                },
                
                // 响应输入框敲入回车的事件
                specialkey: function(cb, e){
                    var key     = e.getKey()
                        parent  = cb.up('sm_tagfield'),
                        tag     = cb.getRawValue(),
                        tid     = cb.getValue();
                    if (Ext.isEmpty(tag)) return false;
                    
                    // 敲入回车, 且下拉框已收起
                    if (key == e.ENTER && !cb.isExpanded) {
                        // tag = id时为新建标签
                        if (tag == tid && parent.checkTag(tag)) {
                            // 加入store
                            var Model = cb.getStore().getProxy().getModel(),
                                item = Ext.create(Model);
                            item.set(cb.displayField , tag);
                            item.save({
                                success: function(b, o) {
                                    tid = o.records[0].data.id;
                                    parent.addTag(tid, tag);    // 添加tag
                                    cb.reset();
                                },
                                failure: function(b, o) {
                                    sTop('无法加入标签【'+tag+'】,请确认是否已经存在该标签');
                                }
                            })
                        }
                    }
                }
            }
        }
    ],
    
    // function
    onAfterRender: function(grid, e) {
        var me = this,
            combo = me.down('combo');
        me.setTagList(me.down('#s_tab_tag_list'));
        combo.bindStore(me.store);
        combo.displayField = me.displayField;
        combo.valueField = me.valueField;
        combo.queryParam = me.queryParam;
    },
    checkTag: function(tag) {
        // 检测输入的Tag: 1.是否有重 2.是否新添加
        var me = this,
            result = true;
        me.tagList.items.each(function(item){
            //console.log(item);
            if (item.getTag() == tag) {
                result = false;
            }
        });
        return result;
    },
    // 当赋值给ownerId后加载tag列表
    applyOwnerId: function(oid) {
        var me = this;
        if (oid) {
            Ext.Ajax.request({
                url: me.tagUrl,
                params: {
                    op:     'read',
                    model:  me.ownerModel,
                    mid:    oid
                },
                success: function(response){
                    var tags = Ext.decode(response.responseText);
                    me.reset(); // 清除之前的tag列表
                    Ext.each(tags, function(tag){
                        //console.log(tag);
                        me.tagList.add({
                            xtype: 'sm_tag',
                            parent: me.tagList,
                            tagUrl: me.tagUrl,
                            model:  me.ownerModel,
                            mid:    oid,
                            tid:    tag.id,
                            tag:    tag.tag
                        });
                    })
                }
            });
        }
        return oid;
    },
    // 获取tag的列表值: 12,33,44  id号以逗号隔开
    getValue: function() {
        var me = this,
            result = [];
        me.tagList.items.each(function(item){
            result.push(item.getTid())
        });
        return result.join(',')
    },
    // 重置tag列表,但不触发删除操作
    reset: function() {
        var me = this;
        me.tagList.removeAll();
    },
    // 添加关联关系成功后，再显示该tag
    addTag: function(tid,tag) {
        var me = this;
        Ext.Ajax.request({
            url: me.tagUrl,
            params: {
                op:     'add',
                model:  me.ownerModel,
                mid:    me.ownerId,
                tid:    tid
            },
            success: function(response){
                console.log('add ok');
                me.tagList.add({
                    xtype: 'sm_tag',
                    parent: me.tagList,
                    tagUrl: me.tagUrl,
                    model:  me.ownerModel,
                    mid:    me.ownerId,
                    tid:    tid,
                    tag:    tag
                });
            }
        });
    }
});