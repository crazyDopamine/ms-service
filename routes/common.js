var express = require('express');
var router = express();
var models = require('../model/models');
var global = require('../global');
var modelConfigs = require('../model/modelConfig');
var modelConfig = modelConfigs.model;

var getParams = function (req) {
    return Object.assign({},req.params,req.query,req.body);
}

var transformData = function(data){
    if(data.dataList){
        var list = [];
        for(var i in data.dataList){
            list.push(transformData(data.dataList[i]));
        }
        data.dataList = list;
    }else{
        if(data.toJSON){
            data = data.toJSON();
        }
        for(var key in data){
            if(data[key]&&typeof data[key] == 'object'&&data[key].getTime&&true){
                data[key] = data[key].getTime();
            }
        }
    }
    return data;
}

var success = function(res,data){
    res.statusCode = 200;
    if(data){
        data = transformData(data);
    }
    var result = {
        code:global.resCode.SuccessCode,
        success:true,
        data:data?data:{}
    }
    res.json(result);
}

var fail = function(res,data){
    res.statusCode = 400;
    var result = {
        code:global.resCode.FailCode,
        success:false,
        data:null
    }
    res.json(result);
}

var initMudule = function(model){
    router.get('/'+model+'/list', function (req, res, next) {
        var params = getParams(req);
        var pageSize = params.pageSize?params.pageSize:global.pageSize;
        var page = params.page?params.page:1;
        var config = {
            order:[['updated_at','DESC']],
            offset:(page-1)*pageSize,limit:pageSize,
            where:Object.assign({},params.where?JSON.parse(params.where):{})
        };
        if(params.order){
            config.order = params.order;
        }
        if(modelConfig[model].api&&modelConfig[model].api.list&&modelConfig[model].api.list.queryConfig){
            config.where = Object.assign({},modelConfig[model].api.list.queryConfig.where,config.where);
            config = Object.assign({},modelConfig[model].api.list.queryConfig,config);
        }
        models[model].findAndCountAll(config).then(function(result){
            success(res,{dataList:result.rows,count:result.count});
        });
    });
    router.get('/'+model+'/detail', function (req, res, next) {
        var params = getParams(req);
        if(!params.id){
            fail(res,{});
            return;
        }
        var config = {};
        if(modelConfig[model].api&&modelConfig[model].api.detail&&modelConfig[model].api.detail.queryConfig){
            Object.assign(config,modelConfig[model].api.detail.queryConfig);
        }
        if(models[model].include){
            config.include = [];
            for(var k in models[model].include){
                config.include.push(models[model].include[k]);
            }
        }
        models[model].findById(params.id,config).then(function(data){
            success(res,data);
        });
    });
    router.post('/'+model+'/insert', function (req, res, next) {
        var params = getParams(req);
        models.getDB().transaction({},function(t){
            var config = {transaction:t};
            if(modelConfig[model].api&&modelConfig[model].api.insert&&modelConfig[model].api.insert.queryConfig){
                Object.assign(config,modelConfig[model].api.insert.queryConfig);
            }
            return models[model].create(params,config);
        }).then(function(result){
            success(res,result);
        }).catch(function(error){
            fail(res,error);
        });
    });
    router.put('/'+model+'/update', function (req, res, next) {
        var params = getParams(req);
        if(!params.id){
            fail(res,{});
            return;
        }
        models[model].findById(params.id).then(function(data){
            if(!data)return;
            var config = {};
            if(modelConfig[model].api&&modelConfig[model].api.update&&modelConfig[model].api.update.queryConfig){
                Object.assign(config,modelConfig[model].api.update.queryConfig);
            }
            data.update(params,config).then(function(data){
                success(res,data);
            })
        });
    });
    router.delete('/'+model+'/delete', function (req, res, next) {
        var params = getParams(req);
        if(!params.id){
            fail(res,{});
            return;
        }
        models[model].findById(params.id).then(function(data){
            if(!data){
                fail(res,{});
                return;
            }
            var config = {};
            data.destroy(config).then(function(){
                success(res,{});
            });
        });
    });
}

for(var model in models){
    initMudule(model);
}

module.exports = {
    router:router,
    successFn:success,
    failFn:fail,
    getParams:getParams
};
