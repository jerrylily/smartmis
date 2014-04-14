// model.hd.customer.Invoice
// HD-客户管理-发票
Ext.define('Smart.model.hd.customer.Invoice', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title', 'memo'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer_invoice/'
    }
});
