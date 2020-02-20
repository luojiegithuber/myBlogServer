

const  express = require('express');
const  router = express.Router();
const  multer = require('multer');

//数据库引入
const  mongoose =require('mongoose');

//定义路由A
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("这是index路由哦");
});





module.exports = router;
