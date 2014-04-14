// model.hd.customer.Customer
// HD-客户管理-客户管理
Ext.define('Smart.model.hd.customer.Customer', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'ctype', 'cproperty', 'cfrom', 'paytype', 'country', 'city', 'company', 'memo', 'creator', 'jiondate'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer/'
    }
});
