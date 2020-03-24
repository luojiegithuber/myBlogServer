const mongoose = require('../common/db');

const outbreak = new mongoose.Schema({
    name:String,//国家名称
	currentConfirmedCount:[],
	curedCount:[],
    deadCount:[]
})

//全查找
outbreak.statics.findAll= function (callback) {
       this.find({},callback);
}

//根据名字查找
outbreak.statics.findByName = function (name_ ,callback) {
    this.find({name:name_},callback);
}



const outbreakModel = mongoose.model('outbreak',outbreak);
module.exports = outbreakModel;