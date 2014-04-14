// model.config.Users_division
// 系统设置-用户设置-所属单位
Ext.define('Smart.model.config.Users_division', {
    extend: 'Ext.data.Model',
    fields: ['id', 'user', 'division', 'name'],
    proxy: {
        type: 'sm_rest',
        url : '/users_divisions/'
    }
});
