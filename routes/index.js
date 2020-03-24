

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

router.get('/mongooseTest', function(req, res, next) {
	mongoose.connect('mongodb://localhost/myServer',{UseMongoClilent: true});
	mongoose.Promise = global.Promise
	
	var tom= new Cat({name:'Tom'});
	tom.save(function(err){
		if(err){
			console.log(err)
		}else{
			console.log("数据库连接成功")
		}
	})
	
    res.send("数据库连接测试");
});



module.exports = router;
