// model.hd.customer.MilesCard
// HD-客户管理-里程卡
Ext.define('Smart.model.hd.customer.MilesCard', {
    extend: 'Ext.data.Model',
    fields: ['id', 'mtype', 'cardno', 'memo'],
    proxy: {
        type: 'sm_rest',
        url : '/hd/customer_milescard/'
    }
});
