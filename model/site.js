var mongoose = require('../common/db');

var site = new mongoose.Schema({
    title:String,
    date:String,
    url:String,
})

//全查找
site.statics.findAll= function (callback) {
    this.find({},callback);
}


//根据名字查询
site.statics.findByUrl = function (url ,callback) {
    this.find({url:url},callback);
}

//根据id查找
site.statics.deleteUrl = function (id ,callback) {
    this.find({_id:id},callback);
}



var siteModel = mongoose.model('site',site);
module.exports = siteModel;