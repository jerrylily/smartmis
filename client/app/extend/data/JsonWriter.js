// 重载Json Writer ，可以提交 hasmany的数据
Ext.define('Smart.extend.data.JsonWriter', {
    extend: 'Ext.data.writer.Json',
    alias: 'writer.sm_json',
    writeAllFields: false,
    getRecordData: function(record){
        var me = this;
        Ext.each(record.associations.items, function(association) {
                if (association.type == 'hasMany') {
                    data[association.name] = [];
                    childStore = record[association.name]();
                    childStore.each(
                        function(childRecord) {
                            data[association.name].push(this.getRecordData(childRecord));
                        }, me);
                    return true;
                }
                if (association.type == 'hasOne' || association.type == 'belongsTo') {
                    data[association.name] = me.getRecordData(record[association.getterName]());
                }
            }
        );
        return record.data;
    }
})