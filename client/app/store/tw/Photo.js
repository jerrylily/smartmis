// store.tw.Photo
// 台湾自由行-照片集
Ext.define('Smart.store.tw.Photo', {
    extend: 'Smart.extend.data.Store',
    model: 'Smart.model.tw.Photo',
    pageSize: 6,
    autoSync: true,
    autoLoad: false,
    sorters: [{property:'id', direction: 'DESC'}]
});