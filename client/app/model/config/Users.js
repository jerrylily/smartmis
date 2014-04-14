// model.config.Users
// 系统设置-用户设置
Ext.define('Smart.model.config.Users', {
    extend: 'Ext.data.Model',
    fields: ['id', 'username', 'first_name', 'last_name', 'email', 'is_superuser', 'is_active', 'psw'],
    proxy: {
        type: 'sm_rest',
        url : '/users/'
    }
});
