var express = require('express');
var router = express.Router();
var site = require('../model/site');
var date = require("silly-datetime");
var request = require('request');
var cheerio = require('cheerio');

var today = date.format(new Date(),'YYYY-MM-DD');      // 2019-01-01


/* GET users listing. */
router.post('/1', function(req, res, next) {
        res.json({status:0,message:today.toString()});
});


//获取所有的网址
router.get('/getallURL',function(req, res, next) {

    site.findAll(function (err,siteSave){

        res.json({status:1,message:siteSave})

    })

});
router.post('/getallURL',function(req, res, next) {

        res.json({status:1,message:"bububububububu"})


});



//删除网址接口
router.post('/deleteURL',function(req, res, next) {

    site.deleteUrl(req.body._id,function (err,resSave){
//
        if(resSave.length==0){
            //返回错误信息
            res.json({status:0,message:"该数据不存在！无法删除操作"})
        }else{

            site.remove({_id:req.body._id} , function(err, resSave){
                if (err) {
                    res.json({status:0,message:err});
                }
                else {
                    res.json({status:1,message:"成功"});
                }
            })
        }

    })

});



//新增网址接口
router.post('/addNewUrl',function(req, res, next) {
    if(!req.body.url){
        res.json({status:0,message:"网址为空！"})
    }
	

    site.findByUrl(req.body.url,function (err,siteSave) {
        if(siteSave.length!=0){
            //返回错误信息
            res.json({status:0,message:"该网页已存在！"})
        }else{

            var url_title='';

            request(req.body.url,function(err,result){
                if(err){
                    console.log(err);
                }
                var $ = cheerio.load(result.body);
                url_title=$('title').text().toString(); // 打印标题
                var newSite = new site({
                    title:url_title,
                    url:req.body.url,
					__v:req.body.__v,
                    date:today.toString()
                })

                newSite.save(function(error,result){
					
					site.updateOne({_id:result._id},{__v:req.body.__v,},function (err,ret) {
				           if(err) {
					             console.log('更新__v失败')
								 res.send("失败啦")
				                } 
							res.json({status:0,message:"插入新网址成功！:"+url_title})	
				           })
					
                    
                })



            })


        }

    })

});



module.exports = router;