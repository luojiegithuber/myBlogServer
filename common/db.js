var mongoose =require('mongoose');
var url = 'mongodb://localhost/myServer'

mongoose.connect(url);
//连接数据库

module.exports = mongoose;

/*
这里代码引入了Mongoose作为连接的中间件,并且连接到相关的数据库地址,
之后将其以包的形式抛给后面的组件使用
*/