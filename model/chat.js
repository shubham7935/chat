var mongoose = require('mongoose'),
schema = mongoose.Schema;
chatSchema = new schema({
	userName:{type:String,required:true},
	message:{type:String},
	data:{type:String},
	image:{type:String},
	sendto:{type:String}
	
})
module.exports = mongoose.model('chat',chatSchema);

