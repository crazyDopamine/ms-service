/**
 * Created by dongwei on 16/9/18.
 */
var Sequelize = require('sequelize');
// Sequelize.DATE.prototype.$stringify = function (date, options) {
//     date = this.$applyTimezone(date, options);
//     return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
// };
var modelConfigs = require('../model/modelConfig');
var modelConfig = modelConfigs.model;
var initData = require('../model/initData');
var sequelize = new Sequelize('masa', 'postgres', 'dw2587758',{
    host:'localhost',
    port:'5432',
    dialect:'postgres',
    pool:{
        min:0,
        max:20,
        idle: 10000
    },
    sync:{force: true},
    version:1.0
});
var commonConfig = {
    timestamps:true,
    paranoid: true,
    underscored: true
}

var models = {};
var config;
for(var tableName in modelConfig){
    config = Object.assign({tableName:tableName},modelConfig[tableName],commonConfig);
    models[tableName]=sequelize.define(
        config.tableName,
        modelConfig[tableName].field,
        config
    );
    models[tableName].include={};
}
if(modelConfigs.relation)modelConfigs.relation(models);

sequelize.sync({force: true}).then(function(){
    for(var tableName in initData){
        if(!models[tableName])continue;
        models[tableName].bulkCreate(initData[tableName]);
    }
});
 
models.getDB=function(){
    return sequelize;
}

module.exports=models;