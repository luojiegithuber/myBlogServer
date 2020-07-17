const express = require('express');
const router = express.Router();
const user = require('../model/user');
const crypto = require('crypto');
const  multer = require('multer');
let fs = require("fs");


const init_token = 'TKLO2o';


router.post('/1', function(req, res, next) {
  res.send("这是users路由哦");
});

const upload = multer({
    dest:"myUpload/"//上传文件存放路径
});

const singleMidle = upload.single("head");//一次处理一张

//接收过来的头像文件
router.post('/touxiang', singleMidle, function(req, res, next) {
    console.log(req);
    let file = req.file;
    fs.renameSync('myUpload/' + file.filename, 'myUpload/' + file.originalname);//这里修改文件名字
    res.send("服务器结束工作");
});

//获得用户头像src
router.get('/download/:picture',function (req,res) {
    console.log(req.params.picture);
    res.sendFile(process.cwd()+"/myUpload/"+req.params.picture+".jpg")
});


router.post('/22', function(req, res, next) {
  res.json({status:0,message:req.body.username});
  res.send('respond with doyoulove resource');
});

//获取MD5值
function getMD5Password(id) {
    var md5 = crypto.createHash('md5');
    var token_before = id + init_token
  return md5.update(token_before).digest('hex');
};

//用户登录接口
router.post('/login',function(req, res, next) {
  if(!req.body.username){
    res.json({status:0,message:"用户名为空！"})
    return;
  }
  if(!req.body.password){
    res.json({status:0,message:"密码为空！"})
    return;
  }

  user.findByUserLogin(req.body.username,req.body.password,function (err, userSave) {
      if(userSave.length!=0){
        //通过md5查看密码
        var token_after = getMD5Password(userSave[0]._id)
        res.json({status:1,data:{token:token_after,user:userSave},message:"用户登陆成功！"})
        return;
      }else{
        //返回空

        res.json({status:0,message:"用户名或者密码错误"})
        return;
      }
  })
});

//用户注册接口
router.post('/register',function(req, res, next) {
  if(!req.body.username){
    res.json({status:0,message:"用户名为空！"})
  }
  console.log(user);
  user.findByUsername(req.body.username,function (err,userSave) {
       if(userSave.length!=0){
         //返回错误信息
         res.json({status:0,message:"用户已注册！"})
       }else{

         var registerUser = new user({
           username:req.body.username,
           password:req.body.password,
           userPhone:req.body.userPhone
         })

         registerUser.save(function(){
           res.json({status:0,message:"注册成功！"})
         })
       }

  })

});

module.exports = router;
