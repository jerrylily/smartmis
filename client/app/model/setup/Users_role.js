// model.setup.Users_role
// 管理中心-用户设置-所有角色
Ext.define('Smart.model.setup.Users_role', {
    extend: 'Ext.data.Model',
    fields: ['id', 'user', 'role', 'name'],
    proxy: {
        type: 'sm_rest',
        url : '/users_roles/'
    }
});
