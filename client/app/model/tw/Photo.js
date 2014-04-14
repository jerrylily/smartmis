// model.tw.Photo
// 台湾自由行-照片集
Ext.define('Smart.model.tw.Photo', {
    extend: 'Ext.data.Model',
    fields: ['id', 'district', 'pclass', 'title', 'photo', 'photo_1000', 'photo_500', 'photo_100'],
    proxy: {
        type: 'sm_rest',
        url : '/tw/photo/',
        writer: {
            type: 'json',
            writeAllFields: false       // 仅提交修改字段
        }
    }
});
