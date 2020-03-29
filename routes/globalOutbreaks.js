const  express = require('express');
const  router = express.Router();
const  multer = require('multer');
var globalOutbreak= require('../model/globalOutbreak');

//数据库引入
const  mongoose =require('mongoose');

//定义路由A
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("这是index路由哦");
});



//得到newslist数据————用于WorldMap
router.get('/getNewslist',function(req, res, next) {

    //经典重名问题
	//res.json 不是一个函数
	globalOutbreak.findByName("worldmap",function(err,res2){
		//console.log(res2[0].newslist)
		res.json({status:1,message:res2[0].newslist})
	})
});

//更新newslist
router.post('/updateNewslist',function(req, res, next) {

		globalOutbreak.updateOne({name:'worldmap'},{
			newslist:req.body.data,
		}, function (err,ret) {
			if(err) {
				console.log('更新失败')
				console.log(err)
			} else {
			  console.log('newslist更新成功:')
			}})
});

//得到增长数据————用于GlobalPie
router.get('/getInc',function(req, res, next) {
	globalOutbreak.findByName("inc",function(err,res2){
		res.json({status:1,message:res2[0]})
	})
});

//更新Global的数据
router.post('/updateInc',function(req, res, next) {
	    
		console.log(req.body.data)
		
		var confirmedIncr_Arr = []
		var currentConfirmedIncr_Arr = []
		var curedIncr_Arr = []
		var deadIncr_Arr = []
		
	    globalOutbreak.findByName("inc",function(err,res2){
			console.log(res2)
	    	confirmedIncr_Arr=res2[0].confirmedIncr
			currentConfirmedIncr_Arr=res2[0].currentConfirmedIncr
			curedIncr_Arr=res2[0].curedIncr
			deadIncr_Arr=res2[0].deadIncr
			
			console.log(confirmedIncr_Arr)
			if(new Date().getHours()==23){
				console.log("现在是晚上23点,更新数据而不是添加")
				confirmedIncr_Arr.pop()
				currentConfirmedIncr_Arr.pop()
				curedIncr_Arr.pop()
				deadIncr_Arr.pop()
			}
				
			
			confirmedIncr_Arr.push(req.body.data.confirmedIncr)
			currentConfirmedIncr_Arr.push(req.body.data.currentConfirmedIncr)
			curedIncr_Arr.push(req.body.data.curedIncr)
			deadIncr_Arr.push(req.body.data.deadIncr)
			
			globalOutbreak.updateOne({name:'inc'},{
				newslist:req.body.data, //当日所有资料的对象
				confirmedIncr:confirmedIncr_Arr,//新增确诊
				currentConfirmedIncr:currentConfirmedIncr_Arr,//新增现存确诊
				curedIncr:curedIncr_Arr,//新增治愈
				deadIncr:deadIncr_Arr,//新增死亡
				
			}, function (err,ret) {
				if(err) {
					console.log('更新失败')
					console.log(err)
				} else {
				  console.log('Inc更新成功:')
				}})
	    })

});

router.post('/updateIncOld',function(req, res, next) {
	    
		console.log(req.body.data)
		
		var confirmedIncr_Arr = []
		var currentConfirmedIncr_Arr = []
		var curedIncr_Arr = []
		var deadIncr_Arr = []
		
	    globalOutbreak.findByName("inc",function(err,res2){

			
	    	confirmedIncr_Arr=res2[0].confirmedIncr
			currentConfirmedIncr_Arr=res2[0].currentConfirmedIncr
			curedIncr_Arr=res2[0].curedIncr
			deadIncr_Arr=res2[0].deadIncr
			
			
			
			//头部添加
			confirmedIncr_Arr.unshift(req.body.data.confirmedIncr)
			currentConfirmedIncr_Arr.unshift(req.body.data.currentConfirmedIncr)
			curedIncr_Arr.unshift(req.body.data.curedIncr)
			deadIncr_Arr.unshift(req.body.data.deadIncr)
			
			globalOutbreak.updateOne({name:'inc'},{

				confirmedIncr:confirmedIncr_Arr,//新增确诊
				currentConfirmedIncr:currentConfirmedIncr_Arr,//新增现存确诊
				curedIncr:curedIncr_Arr,//新增治愈
				deadIncr:deadIncr_Arr,//新增死亡
				
			}, function (err,ret) {
				if(err) {
					console.log('更新失败')
					console.log(err)
				} else {
				  console.log('Inc旧数据更新成功:')
				}})
	    })

});

//所有数据
router.get('/getAll',function(req, res, next) {
    outbreak.findAll(function (err,allOutbreak){
        res.json({status:1,message:allOutbreak})
    })
});

//初始化
router.get('/init',function(req, res, next) {
   var worldmap = new globalOutbreak({

                     name:'worldmap',
                     newslist:[],
					 
					 //这些数据不属于我
					 confirmedIncr:[],
					 currentConfirmedIncr:[],
					 curedIncr:[],
					 deadIncr:[],

                })
				
  worldmap.save(function(){console.log("地图初始化")})//保存到数据库*/
  
  var inc = new globalOutbreak({
  
                     name:'inc',
					 
                     newslist:[],//该数据不属于我
  					 
  					 confirmedIncr:[],
  					 currentConfirmedIncr:[],
  					 curedIncr:[],
  					 deadIncr:[],
					 
  
                })
  				
  inc.save(function(){console.log("增长数据初始化")})//保存到数据库*/
});

module.exports = router;