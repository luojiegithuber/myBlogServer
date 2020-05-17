const  express = require('express');
const  router = express.Router();
const  multer = require('multer');
var outbreak= require('../model/outbreak');

//数据库引入
const  mongoose =require('mongoose');
var flag=true

var Hour=12

//定义路由A
/* GET home page. */
router.get('/hello', function(req, res, next) {
	
	
	let time = new Date()
	if(time.getHours()!=Hour){flag=true}
	
	
	//未解锁
	if(flag==false){
		let k=60-new Date().getMinutes()
		res.send("一个小时内无法访问接口,距离重新开放还有"+k+"分钟")
	}else{
		if(time.getHours()==Hour){
			flag=false	
		}//如果是12点访问,第一次可以成功,之后上锁,一个小时内无法访问接口
		
	}
	
	res.send("代码执行")
    
	
});

//所有数据
router.get('/getAll',function(req, res, next) {
    outbreak.findAll(function (err,allOutbreak){
        res.json({status:1,message:allOutbreak})
    })
});

//获得所有数据的增长率＋现存确诊
router.get('/getAll2',function(req, res, next) {
    outbreak.findAll(function (err,allOutbreak){
		
		//处理一下allOutbreak,只要7天的就行了
		
		allOutbreak.forEach((obj,index,arr)=>{
			obj.currentConfirmedCount=obj.currentConfirmedCount.slice(-7)
			obj.curedCount=obj.curedCount.slice(-7)
			obj.deadCount=obj.deadCount.slice(-7)
		})
		
        res.json({status:1,message:allOutbreak})
    })
});

router.get('/getAll_CAGR',function(req, res, next) {
    outbreak.findAll(function (err,allOutbreak){
		
		let result=[]
		//处理一下allOutbreak,只要7天的就行了
		
		allOutbreak.forEach((obj,index,arr)=>{
			obj.currentConfirmedCount=obj.currentConfirmedCount.slice(-7)
			obj.curedCount=obj.curedCount.slice(-7)
			obj.deadCount=obj.deadCount.slice(-7)
			
			let confirmedCount=add(add(obj.currentConfirmedCount,obj.curedCount),obj.deadCount)
			let min = confirmedCount[0]
			let max = confirmedCount[6]

            //每个数组格式[国家,增长率,现存确诊]
			let currentConfirmedCount=obj.currentConfirmedCount[6]>0?obj.currentConfirmedCount[6]:0
			let oneResult=[currentConfirmedCount,(CAGR(min,max,7)*100).toFixed(2),obj.name]
			
			result.push(oneResult)
		})
		
		
		
		//7天增长率计算,7天为一期
		function CAGR(start,end,day){
		   if(start==0){start=1}
		   if(end==0)return 0
		   return Math.pow((end/start), (1/day)) -1
		
		}
		
		//数组和
		function add(arr1,arr2){
		   return arr1.map((val,index)=>{
		        return val+arr2[index]
		   })
		}
		
	  
        res.json({status:1,message:result})
    })
});


router.post('/getByname',function(req, res, next) {
    outbreak.findByName(req.body.name,function (err,allOutbreak){
        res.json({status:1,message:allOutbreak})
    })
});

//更新/插入数据
router.post('/newAll',function(req, res, next) {
	
	/********************************/
	let time = new Date()
	if(time.getHours()!=Hour){flag=true}
	
	
	//未解锁
	if(flag==false){
		let k=60-new Date().getMinutes()
		res.send("一个小时内无法访问接口,距离重新开放还有"+k+"分钟")
	}else{
		if(time.getHours()==Hour){
			flag=false	
		}//如果是12点访问,第一次可以成功,之后上锁,一个小时内无法访问接口
		
	}
	/********************************/
	
	
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
										 
										 console.log(new Date().getHours())
										 if(new Date().getHours()!=Hour){
										 	console.log("现在不是12点,更新数据而不是添加")
											
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
									 
									if(new Date().getHours()!=Hour){
									 	A.pop()
									 	B.pop()
									 	C.pop()
									 }
									 
									 A.push(currentConfirmedCount)
									 B.push(curedCount)
									 C.push(deadCount)
									
									 

									 
									 
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
	 
	 res.json({status:1,message:"outbreak更新成功"})
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
			 
			 A.push(0)
			 B.push(0)
			 C.push(0)//所有数据添加一列0 之后在更新
			 
			 //如果改名字存在在newlist,再继续更新头部
			 let result = newslist.find(function (news_obj) { if (news_obj.provinceName== obj.name) { return news_obj;}})
			 if(!result){
			 	console.log("以前不存在的数据国家:"+obj.name)
			 }else{
			 	//更新头部
				let len=A.length-1
				A[len]=result.currentConfirmedCount
				B[len]=result.curedCount
				C[len]=result.deadCount
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