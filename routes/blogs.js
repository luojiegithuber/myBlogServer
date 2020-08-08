var express = require('express');
var router = express.Router();
var blog = require('../model/blog');
var date = require("silly-datetime");
const  multer = require('multer');
const multiparty = require('multiparty')

let fs = require("fs");

let loveCount=39 //❤

const upload = multer({
    dest:"Blog_picture/"//博客导览图片的保存位置
});

const singleMidle = upload.single("head");//一次处理一张
const manyFile = upload.array("head",20)

//接收过来的头像文件
router.post('/touxiang', singleMidle, function(req, res, next) {
    console.log(req.file);
    let file = req.file;
    fs.renameSync('myUpload/' + file.filename, 'myUpload/' + file.originalname);//这里修改文件名字
    res.send("服务器结束工作");
});




/* GET users listing. */
router.post('/1', function(req, res, next) {

    res.json({status:0,message:"这里是博客接口"+today.toString()});

});

router.get('/addCount', function(req, res, next) {

    loveCount++
    res.json({status:1,message:loveCount});

});

router.get('/getLoveCount', function(req, res, next) {
    

    res.json({status:1,message:loveCount});

});

//获取所有的网址
router.get('/getAllBlog',function(req, res, next) {

    blog.findAll(function (err,siteSave){

        res.json({status:1,message:siteSave})

    })

});

router.post('/getBlog',function(req, res, next) {

    blog.findByID(req.body._id,function (err,siteSave){

        res.json({status:1,message:siteSave})

    })

});

router.get('/getBlog/:_id',function(req, res, next) {

    blog.findByID(req.params._id,function (err,siteSave){

        res.json({status:1,message:siteSave})

    })

});

router.post('/Picture_url',function(req, res, next) {
    var form = new multiparty.Form({uploadDir: 'tempPictureDir/' });// 指定文件存储目录
    form.parse(req, function(err, fields, files) {


        if (err) {console.log(err)}
        else {
            //返回数据为 res = [[pos, url], [pos, url]...]
            let resArr=[]
            for(let pos in files){
                let pos2=files[pos][0].fieldName
                let url="api2/blogs/Picture_url/"+files[pos][0].path.split('\\')[1]
                let res_item=[pos2,url]
                resArr.push(res_item)
            }
            res.json({status:1,message:"图片上传成功！",data:resArr})
        }
    });

});

//动态路由取图片
router.get('/Picture_url/:picture',function(req, res, next) {
    console.log(process.cwd()+"/"+req.params.picture)
    res.sendFile(process.cwd()+"/tempPictureDir/"+req.params.picture)
});


//主页视频栏目取预览图片
router.get('/homevideo/:name',function(req, res, next) {
    console.log(process.cwd()+"/"+req.params.name)
    res.sendFile(process.cwd()+"/homevideo/"+req.params.name)
});

//主页视频栏目取视频
router.get('/homevideo/:name',function(req, res, next) {
    console.log(process.cwd()+"/"+req.params.name)
    res.sendFile(process.cwd()+"/homevideo/"+req.params.name)
});

//新增博客
router.post('/addNewBlog',singleMidle,function(req, res, next) {
    
	var today = date.format(new Date(),'YYYY-MM-DD');      // 2019-01-01

    //处理博客文本内容
              var newBlog = new blog({

                    title:req.body.title,//标题
                    maintype: req.body.maintype,
                    date:today,//发布日期
                    content:req.body.content,//内容（核心）
                    tag:req.body.tag,//标签（字符串数组）
                    isPublic:req.body.isPublic, //是否公开
                    note:req.body.note//备注

                })


                newBlog.save(function(){
                    //处理博客导览图片保存
                    let file = req.file;
                    fs.renameSync('Blog_picture/' + file.filename, 'Blog_picture/' + newBlog._id+'.jpg');//这里博客id为名字的图片文件
                    res.json({status:1,message:"博客发表成功！"})
                })

});

//获得博客导览图片
router.get('/getAllBlog/:picture',function (req,res) {
    res.sendFile(process.cwd()+"/Blog_picture/"+req.params.picture+".jpg")
});

module.exports = router;