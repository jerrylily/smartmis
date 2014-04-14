// model.hd.customer.Phone
// HD-客户管理-客户电话
Ext.define('Smart.model.hd.customer.Phone', {
    extend: 'Ext.data.Model',
    fields: ['id', 'ptype', 'pnumber', 'pext', 'memo'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer_phone/'
    }
});
