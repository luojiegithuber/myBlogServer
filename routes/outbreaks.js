const  express = require('express');
const  router = express.Router();
const  multer = require('multer');
var outbreak= require('../model/outbreak');

//数据库引入
const  mongoose =require('mongoose');

//定义路由A
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("这是index路由哦");
});

//所有数据
router.get('/getAll',function(req, res, next) {
    outbreak.findAll(function (err,allOutbreak){
        res.json({status:1,message:allOutbreak})
    })
});

router.post('/getByname',function(req, res, next) {
    outbreak.findByName(req.body.name,function (err,allOutbreak){
        res.json({status:1,message:allOutbreak})
    })
});

//更新/插入数据
router.post('/newAll',function(req, res, next) {
	 let newslist=req.body.data
	 //console.log(newslist)//打印newslist
	 
	 //查看记录天数(数组长度)
     var count_arr=0
	 outbreak.findByName("法国",function(err,res_item){
		 count_arr=res_item[0].currentConfirmedCount.length
		 console.log("我已经记录的天数:"+count_arr)
	 })
	 
	 
	 
	 newslist.forEach(function(val,index,arr){
	 						  //val是一个对象
	 						  var name = val.provinceName//国家名称
							  
	 						  var currentConfirmedCount = val.currentConfirmedCount//现存确诊
							  var curedCount = val.curedCount//治愈
							  var deadCount = val.deadCount//死亡
							  
							  outbreak.findByName(name,function(err,res_item){
								  
								  
								  if(err)console.log(err)
								  
								  
								  else{
									 //console.log(res_item)
									 
									
									 if(res_item.length==0||res_item[0]==undefined){
										 //说明国家更新了,多了几个国家,要加入数据库大家庭了
										 //先确定当前记录天数,数据数组长度count_arr
										 console.log("[!]今天更新的国家是:"+name)
										 
										 if(count_arr!=0){var zero_arr = new Array(count_arr).fill(0);}
										 else { var zero_arr=[] }
											 
										 var new_A=zero_arr.concat()
										 var new_B=zero_arr.concat()
										 var new_C=zero_arr.concat()
										 
										 if(new Date().getHours()==23){
										 	console.log("现在是晚上23点,更新数据而不是添加")
										 	new_A.pop()
										 	new_B.pop()
										 	new_C.pop()
										 }
										 
										 new_A.push(currentConfirmedCount)
										 new_B.push(curedCount)
										 new_C.push(deadCount)

										 var outbreak_item = new outbreak({
										 
										        name:name,
										        currentConfirmedCount:new_A,
										        curedCount:new_B,
										        deadCount:new_C
										 
										   })
										 				
										 outbreak_item.save(function(){console.log(name+":新国家保存成功")})//保存到数据库*/
										 
									 }else{
										 
										 
								     //老国家	 
									 var A=[]
									 var B=[]
									 var C=[]
									 
									 A=res_item[0].currentConfirmedCount
									 B=res_item[0].curedCount
									 C=res_item[0].deadCount
									 
									 if(new Date().getHours()==23){
									 	A.pop()
									 	B.pop()
									 	C.pop()
									 }
									 
									 A.push(currentConfirmedCount)
									 B.push(curedCount)
									 C.push(deadCount)
									
									 
									 
									 /*A.pop()
									 B.pop()
									 C.pop()*/
									 
									 
									 
									 outbreak.updateOne({name:name},{
									  	currentConfirmedCount:A,
									  	curedCount:B,
									  	deadCount:C
									  }, function (err,ret) {
									  	if(err) {
									  		console.log('更新失败')
									 		console.log(err)
									  	} else {
									 		//console.log('更新成功:'+name)
									  	}
									  })	
									 }
								  }
							  })
							  

							 	   
							  
	 })
	 
	 res.json({status:1,message:"一切都成功啦"})
});

//更新插入旧数据
router.post('/newAllOld',function(req, res, next) {
	 var newslist=req.body.data
	 //console.log(newslist)//打印newslist
	 
	 outbreak.findAll(function (err,allOutbreak){
		 console.log("数据库一共有:"+allOutbreak.length)
		 var count_new=0
	     allOutbreak.forEach(function(obj,index,arr){
			 let A=obj.currentConfirmedCount
			 let B=obj.curedCount
			 let C=obj.deadCount
			 
			 A.unshift(0)
			 B.unshift(0)
			 C.unshift(0)//所有数据添加一列0 之后在更新
			 
			 //如果改名字存在在newlist,再继续更新头部
			 let result = newslist.find(function (news_obj) { if (news_obj.provinceName== obj.name) { return news_obj;}})
			 if(!result){
			 	console.log("以前不存在的数据国家:"+obj.name)
			 }else{
			 	//更新头部
				A[0]=result.currentConfirmedCount
				B[0]=result.curedCount
				C[0]=result.deadCount
			 }
			 
			 outbreak.updateOne({name:obj.name},{
			  	currentConfirmedCount:A,
			  	curedCount:B,
			  	deadCount:C
			  }, function (err,ret) {
			  	if(err) {
			  		//console.log('旧数据更新失败')
			 		console.log(err)
			  	} else {

			  	}
			  })
			  
		 })
	 })
						 	   
	 res.json({status:1,message:"一切都成功啦"})
});

router.post('/newAll_first',function(req, res, next) {
	 let newslist=req.body.data
	 console.log(newslist)//打印newslist
	 
	 newslist.forEach(function(val,index,arr){
	 						  //val是一个对象
	 						  let name = val.provinceName//国家名称
							  
	 						  let currentConfirmedCount = val.currentConfirmedCount//现存确诊
							  let curedCount = val.curedCount//治愈
							  let deadCount = val.deadCount//死亡
							  
							  let A=[]
							  let B=[]
							  let C=[]
							  
							  A.push(currentConfirmedCount)
							  B.push(curedCount)
							  C.push(deadCount)
							  
              var outbreak_item = new outbreak({

                     name:name,
                     currentConfirmedCount:A,
	                 curedCount:B,
                     deadCount:C

                })
				
				outbreak_item.save(function(){console.log(outbreak.name)})//保存到数据库*/
	 })
	 
	 res.json({status:1,message:"一切都成功啦"})
});

module.exports = router;