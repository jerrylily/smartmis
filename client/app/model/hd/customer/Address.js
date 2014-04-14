// model.hd.customer.Address
// HD-客户管理-客户地址
Ext.define('Smart.model.hd.customer.Address', {
    extend: 'Ext.data.Model',
    fields: ['id', 'atype', 'address', 'memo'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer_address/'
    }
});
