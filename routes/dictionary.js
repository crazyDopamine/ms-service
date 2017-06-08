var express = require('express');
var router = express();
var models = require('../model/models');
var global = require('../global');
var common = require('./common');


/* GET home page. */
router.get('/selections', function (req, res, next) {
    var params = common.getParams(req);
    var config = {
        order: [['id', 'DESC']],
        where:params
    }
    models.dictionary.findAndCountAll(config).then(function(result){
        common.successFn(res,{dataList:result.rows,count:result.count});
    });
});

module.exports = router;
