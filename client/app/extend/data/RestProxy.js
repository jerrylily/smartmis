// 重载proxy，设置默认reader、writer、异常处理、以及REST的自定义URL
Ext.define('Smart.extend.data.RestProxy', {
    extend: 'Ext.data.proxy.Ajax',
    requires: ['Ext.util.Cookies'],
    alias : 'proxy.sm_rest',
    actionMethods: {
        create : 'POST',
        read   : 'GET',
        update : 'PUT',
        destroy: 'DELETE'
    },
    filterParam: 'search',
    appendId: true,
    batchActions: false,
    // json reader
    reader: {
        type: 'json',
        totalProperty: 'count',
        root: 'results'
    },
    // json write
    writer: {
        type: 'json'
    },
    listeners: {
        // 网络异常
        // todo: 1.捕获403错误，以便返回登录界面  2.区分出真实的网络错误
        exception: function(proxy, response, op, e) {
            var action = op.action,
                recs = op.records,
                store = recs ? recs[0].store : null;
            var msg ={};
            msg['read'] = '没找到您要的东东！一会儿再试试^o^';
            msg['update'] = '系统不让修改数据！一会儿再试试^o^';
            msg['destroy'] = '系统舍不得删除这条数据呀！一会儿再试试^o^';
            msg['create'] = '记录添加失败，一会儿再试试^o^';
            if (store) {
                store.rejectChanges();  // 取消所有修改，恢复原值
            }
            var m = Ext.decode(response.responseText);
            console.log(m['results']);
            sTop(msg[action]);
        }
    },
    // 自定义URL，与Django REST framework匹配
    buildUrl: function(request) {
        var me        = this,
            operation = request.operation,
            records   = operation.records || [],
            record    = records[0],
            format    = me.format?me.format:'?format=json',
            url       = me.getUrl(request),
            id        = record ? record.getId() : operation.id;
        // add csrf token
        //var csrf_token = Ext.util.Cookies.get('csrftoken');
        //me.headers = {'X-CSRFToken': csrf_token};
        
        // treestore 会带root参数，去除掉
        if (me.appendId && (id != null) && (id != 'root')) {
            if (!url.match(/\/$/)) {
                url += '/';
            }
            url += id + '/';
        }
        if (format) {
            if (!url.match(/\/$/)) {
                url += '/';
            }
            url += format;
        }
        request.url = url;
        return me.callParent(arguments);
    },
    // 过滤条件url格式
    encodeFilters: function(filters) {
        return filters[0].value;
        /*
        var min = [],
            length = filters.length,
            i = 0;
        for (; i < length; i++) {
            min[i] = filters[i].property + '=' + filters[i].value;
        }
        return this.applyEncoding(min.join('&'));
        */
    }
});