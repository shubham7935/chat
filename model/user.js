var mongoose = require('mongoose'),
schema = mongoose.Schema;
userSchema = new schema({
	userName:{type:String,required:true},
	password:{type:String},
	firstname:{type:String},
	lastname:{type:String},
	mobilenumber:{type:Number},
	pendingRequest:[String],
	FriendList:[String],
	islogin:{type:Boolean,default:false},
	room:{type:String}
	
	

})


module.exports = mongoose.model('user',userSchema);

