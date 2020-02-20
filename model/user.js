var mongoose = require('../common/db');

var user = new mongoose.Schema({
	username:String,
	password:String,
	userPhone:String,
    userId:String
})

//用户的查找方法
user.statics.findAll= function (callback) {
    this.find({},callback);
}


//根据名字查询
user.statics.findByUsername = function (name ,callback) {
    this.find({username:name},callback);
}

//登录匹配
user.statics.findByUserLogin = function(name,password,callback){
    this.find({username:name,password:password},callback)
}



var userModel = mongoose.model('user',user);
module.exports = userModel;