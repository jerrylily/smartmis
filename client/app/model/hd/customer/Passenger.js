// model.hd.customer.Passenger
// HD-客户管理-乘机人
Ext.define('Smart.model.hd.customer.Passenger', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'gender', 'ptype', 'number', 'country', 'birthday', 'valid', 'milecards', 'phone', 'email', 'memo'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer_passenger/'
    }
});
