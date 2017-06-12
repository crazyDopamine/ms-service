var express = require('express');
var router = express();
var global = require('../global');
var common = require('./common');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir:'./file' });
router.use(multipart({uploadDir:'./file' }));
router.post('/editorUpload', multipartMiddleware, function(req, res) {
    console.log(req.headers.host);
    // don't forget to delete all req.files when done
    res.json({link:'http://'+req.headers.host+'/'+req.files.file.path});
});

module.exports = router;
