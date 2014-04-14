Ext.define('Smart.controller.Setup', {
    extend: 'Ext.app.Controller',
    models: [
        'setup.Users',
        'setup.Organize',
        'setup.RoleCombobox',
        'setup.Users_role',
        'setup.Organize_users',
        'setup.PostCombobox'
    ],
    stores: [
        'setup.Users',
        'setup.Organize',
        'setup.RoleCombobox',
        'setup.Users_role',
        'setup.Organize_users',
        'setup.PostCombobox'
    ],
    views: [
        'setup.Users',
        'setup.Organize'
    ],
    refs: [
        {ref: 'org_tree', selector: '#s_page_setup_settings_org'}
    ],
    init: function() {
        this.control(
            {
                /*
                '#s_page_setup_settings_org': {
                    containerclick: this.showTreeMax
                },
                'sm_setup_organize treeview': {
                    highlightitem: this.showTreeMax
                },
                '#s_page_setup_settings_userlist': {
                    containerclick: this.showTreeMin
                },
                'sm_setup_organize gridview': {
                    highlightitem: this.showTreeMin
                }
                */
            }
        );
    },
    showTreeMax: function() {
        var tree = this.getOrg_tree();
        if (tree.getWidth() == 300) tree.setWidth(600);
    },
    showTreeMin: function() {
        var tree = this.getOrg_tree();
        if (tree.getWidth() == 600) tree.setWidth(300);
    }
});
