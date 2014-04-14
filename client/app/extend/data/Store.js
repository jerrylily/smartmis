// 重载Store，加入提交失败后的处理过程
Ext.define('Smart.extend.data.Store', {
    extend: 'Ext.data.Store',
    alias : 'store.sm_store',
    autoSync: false,
    //autoLoad: true, // 自动加载数据，尽量避免自动加载，选择在组件创建后load
    pageSize: 30,
    remoteFilter: true,
    listeners: {
        //add ( store, records, index, eOpts )
        add: function(store, recs, ind, e) {
            //console.log('store add');
            //console.log(store);
            //console.log(recs);
            //console.log(ind);
            //return false; 
        },
        //load( this, records, successful, eOpts )
        load: function(store, recs, successful, e){
            //console.log('store load');
        },
        //remove( store, record, index, isMove, eOpts )
        remove: function(store, rec, index, isMove, e) {
            //console.log('store remove');
        },
        //bulkremove( store, records, indexes, isMove, eOpts )
        bulkremove: function(store, rec, index, isMove, e) {
            //console.log('bulkremove');
        },
        //update( this, record, operation, eOpts )
        update: function(store, rec, op, e) {
            //console.log('store update：'+op);
            //console.log(e);
        },
        //write( store, operation, eOpts )
        write: function(store, op, e) {
            //console.log('store write');
            //console.log(store);
            //console.log(op);
            //console.log(e);
        }
    }
});