const mongoose = require('../common/db');

const globalOutbreak = new mongoose.Schema({
	//这个表保存两种类型 
	
	
    name:String,//类型名称 worldmap  *   inc
	
	newslist:[],//世界地图数据来源
	
	confirmedIncr:[],//新增确诊
	currentConfirmedIncr:[],//新增现存确诊
	curedIncr:[],//新增治愈
    deadIncr:[],//新增死亡
	
})

//全查找
globalOutbreak.statics.findAll= function (callback) {
       this.find({},callback);
}

//根据名字查找
globalOutbreak.statics.findByName = function (name_ ,callback) {
    this.find({name:name_},callback);
}



const globalOutbreakModel = mongoose.model('globalOutbreak',globalOutbreak);
module.exports = globalOutbreakModel;