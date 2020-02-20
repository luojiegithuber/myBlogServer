const mongoose = require('../common/db');

const blog = new mongoose.Schema({
    title:String,//标题
    maintype:String,//主要类型
    date:String,//发布日期（具体到时分秒）
    content:String,//内容（核心）
    tag:[],//标签（字符串数组）
    isPublic:Boolean, //是否公开
    note:String//备注
})

//全查找
blog.statics.findAll= function (callback) {
    this.find({},callback);
}

//根据id查找
blog.statics.findByID = function (id ,callback) {
    this.find({_id:id},callback);
}



const blogModel = mongoose.model('blog',blog);
module.exports = blogModel;