// model.config.Role
// 系统设置-分部角色
Ext.define('Smart.model.config.Role', {
    extend: 'Ext.data.Model',
    fields: ['id', 'division', 'name', {name:'page', defaultValue:[]}],
    proxy: {
        type: 'sm_rest',
        url : '/roles/'
    }
});