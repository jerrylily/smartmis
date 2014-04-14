// model.setup.Organize_users
// 管理中心-组织架构-用户管理
Ext.define('Smart.model.setup.Organize_users', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'organize', 'orgname', 'post', 'pname', 'level'],
    proxy: {
        type: 'sm_rest',
        url : '/organize_users/'
    }
});
