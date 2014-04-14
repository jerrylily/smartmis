// model.hd.customer.CustomerMemo
// HD-客户管理-客户管理-备注
Ext.define('Smart.model.hd.customer.CustomerMemo', {
    extend: 'Ext.data.Model',
    fields: ['id', 'memo'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer/'
    }
});
