Ext.define('Smart.controller.Config', {
    extend: 'Ext.app.Controller',
    models: [
        'config.DictType',
        'config.DictList',
        'config.Module',
        'config.Page',
        'config.System',
        'config.Division',
        'config.Division_admin',
        'config.UserCombobox',
        'config.Users',
        'config.Role',
        'config.PageGrid',
        'config.Users_division',
        'config.DivisionCombobox'
    ],
    stores: [
        'config.DictType',
        'config.DictList',
        'config.Module',
        'config.Page',
        'config.System',
        'config.Division',
        'config.Division_admin',
        'config.UserCombobox',
        'config.Users',
        'config.Role',
        'config.PageGrid',
        'config.Users_division',
        'config.DivisionCombobox'
    ],
    views: [
        'config.Pages',
        'config.Authorization',
        'config.Division',
        'config.Users',
        'config.Roles',
        'config.Settings',
        'config.Help'
    ],
    refs: [
        //{ref: 'page_page', selector: '#s_page_config_pages_pages'}
    ],
    init: function() {
        this.control(
            {
                'sm_config_authorization': {
                    //afterrender: this.authorizationAfterrender
                }
            }
        );
    }
});
