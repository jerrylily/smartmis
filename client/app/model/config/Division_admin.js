// model.config.Division_admin
// 系统设置-单位设置-单位管理员
Ext.define('Smart.model.config.Division_admin', {
    extend: 'Ext.data.Model',
    fields: ['id', 'division', 'user', 'username', 'name'],
    proxy: {
        type: 'sm_rest',
        url : '/divisions_admin/'
    }
});
