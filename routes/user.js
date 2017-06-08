var express = require('express');
var router = express();
var models = require('../model/models');
var tokenModule = require('../model/token');
var global = require('../global');
var common = require('./common');

/* GET home page. */
router.get('/login', function (req, res, next) {
    var params = common.getParams(req);
    models.user.findOne({where: {account: params.account,password:params.password},
        attributes:['id','account','name','type']}).then(function (user) {
        if(user){
            tokenModule.getToken(user.id).then(function(tokenString){
                user.token = tokenString;
                res.statusCode = 200;
                res.cookie(global.CookieKey,tokenString,{maxge:20*60*1000});
                common.successFn(res,user);
            },function(err){
                common.failFn(res,null);
            });
        }else{
            common.failFn(res,null);
        }
    });
});

router.get('/userInfo', function (req, res, next) {
    // var params = common.getParams(req);
    var token = req.cookies[global.CookieKey];
    if(!token){
        res.statusCode=401;
        var result = {
            code:global.resCode.FailCode,
            success:false,
            data:null
        }
        res.json(result);
        return;
    }
    tokenModule.checkToken(token).then(function(userId){
        models.user.findOne({where:{id:userId},
            attributes:['id','account','name','type'],}).then(function(user){
            if(user){
                common.successFn(res,user);
            }else{
                res.statusCode=401;
                var result = {
                    code:global.resCode.FailCode,
                    success:false,
                    data:null
                }
                res.json(result);
            }
        });
    },function(err){
        res.statusCode=401;
        var result = {
            code:global.resCode.FailCode,
            success:false,
            data:null
        }
        res.json(result);
    });
});

module.exports = router;
