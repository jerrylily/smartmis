// model.hd.customer.CustomerPropty
// HD-客户管理-客户管理
Ext.define('Smart.model.hd.customer.CustomerPropty', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'ctype', 'cproperty', 'cfrom', 'paytype', 'country', 'city', 'company', 'email'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer/'
    }
});
