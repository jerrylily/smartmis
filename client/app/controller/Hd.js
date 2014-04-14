Ext.define('Smart.controller.Hd', {
    extend: 'Ext.app.Controller',
    models: [
        'hd.customer.Customer',
        'hd.customer.CustomerPropty',
        'hd.customer.CustomerMemo',
        'hd.customer.Phone',
        'hd.customer.Address',
        'hd.customer.MilesCard',
        'hd.customer.Invoice',
        'hd.customer.Passenger'
    ],
    stores: [
        'hd.customer.Customer'
    ],
    views: [
        'hd.customer.Customer'
    ],
    refs: [
        //{ref: 'page_page', selector: '#s_page_config_pages_pages'}
    ],
    init: function() {
        this.control(
            {
            }
        );
    }
});
