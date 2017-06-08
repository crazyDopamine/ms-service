var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1',{auth_pass:'dw2587758'});
var models = require('../model/models');

var globalKey={
    userTocken:'USERTOCKEN'
}
client.on('ready',function(err){
    console.log('redis ready!');
});

var checkToken = function(token){
    var promise = new Promise(function(resolve,reject){
        client.HGET(globalKey.userTocken,token,function(err,userId){
            if(!err){
                resolve(userId);
            }else{
                console.log(err);
                reject(err);
            }
        });
    });
    return promise;
}

var getToken = function(userId){
    var promise = new Promise(function(resolve,reject){
        var token = 'token_'+new Date().getTime()+'_'+userId;
        client.HSET(globalKey.userTocken,token,userId,function(err,data){
            if(!err){
                resolve(token);
            }else{
                reject(err);
            }
        });
    });
    return promise;
}

module.exports={
    client:client,
    GlobalKey:globalKey,
    getToken:getToken,
    checkToken:checkToken
}