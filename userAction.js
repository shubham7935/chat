// var jwt = require('jwt');
var user= require('./model/user')
var chat = require('./model/chat')


var socketio = require('socket.io');
//var db = require('./model/chat');

var async =require('async');

exports.getUserFromToken = function(headers, res){
	var token = headers.authorization;
	if(!headers || !headers.authorization){
		return res.json({code:400, message:"Unauthorized action."})
	}
	var decoded = jwt.decode(token, config.secret);
	return decoded._doc;
}


exports.signup= function(req,res)
{
	if(!req.body)
	{
		res.json({
			responseCode:400,
			responseMessage:"Please provide Details"
		})
	}
		else if(!req.body.userName)
		{
			res.json({
			responseCode:400,
			responseMessage:"please provide userName"
		})
		}
		else if(!req.body.password)
		{
			res.json({
              responseCode:400,
			responseMessage:"please provide Password"
		})
		}
		 else
		   {
			var User = new user(req.body)
			User.save(function(err,result)
			{
				if(err)
				{
					res.json({
					responseCode:400,
			       responseMessage:"Something went wrong please try again"
			   })
				}
				
				{
					res.json({
                  responseCode:200,
			      responseMessage:"You have successfully logged in", 
			      result:result
			  })


				}

			})
		}
	}

exports.login = function(req,res)
{
	console.log(req.body)
	if(!req.body)
	{
		return res.json({responseCode:400,responseMessage:"please enter username and password"})
	}
	else
	{
	 user.findOne({userName:req.body.userName,password:req.body.password},function(err,data)
		{
			if(err)
			{
				return res.json({responseCode:400,responseMessage:"something went wrong"})
			}
			else
			{
				return res.json({responseCode:200,responseMessage:"successfully logged in",result:data})
			}
		})
		
}
}

 exports.sendRequest = function(req,res)
 {
 	if(!req.body)
 		{
 			res.json({responseCode:400,responseMessage:"Please provide details"})
 		}
 		else
 		{
 			console.log(req.params.userName)
 			console.log(req.body.userName)

 		 user.findOneAndUpdate({userName:req.params.userName},{$push:{pendingRequest:req.body.userName}},{new:true},function(err,data){
 		 	if(err)
 		 	{
 		 		res.json({responseCode:400,responseMessage:"something went wrong"

 		 	})
 		 	}
 		 	else
 		 	{
                 res.json({responseCode:200,responseMessage:"success", result:data})
 		 	}
 		 })
 		}
 }


 exports.acceptrequest =function(req,res)
{
 	if(!req.body)
 		{
 			res.json({responseCode:400,responseMessage:"Please provide details"})
 		}
 		else
 		{ 
 			 async.waterfall([
 			 	function(callback)
 			 	{
 		      user.findOneAndUpdate({userName:req.body.userName},{$pull:{pendingRequest:req.params.userName}},function(err,data){
 		 	  if(err)
 		 	  {
 		 		callback(err)

 		 	  
 		 	  }
 		 	  else
 		 	  {
                 callback(null,data)
 		 	   }
 		   })
 		},
 		function(data,callback)
 		{
 			user.findOneAndUpdate({userName:req.body.userName},{$push:{FriendList:req.params.userName}},function(err,result){
 				if(err)
 				{
 					callback(err)
 				}
 				else
 					callback(null,data,result)


 			})
 		},
 		function(data,result,callback)
 		{
 			user.findOneAndUpdate({userName:req.params.userName},{$push:{FriendList:req.body.userName}},function(err,results){
 				if(err)
 				{
 					callback(err)
 				}
 				else
 					callback(null,data,result,results)


 			})
 		}
 		],
 		function(err,data,result,results)
 		{
 			if(err)
 			{
 				res.json({responseCode:400,responseMessage:"something went wrong"})
 			}
 			else
 			{
 				res.json({responseCode:200,responseMessage:"friend request accepted",result:result})
 			}
 		})

 		}
 	}
 

 exports.getInfo = function(req,res)

 {
 	console.log('getInfo')
 	if(!req.body)
 	{
 		res.json({responseCode:400,responseMessage:"Please provide some request"})
 	}
 	else
 	{
 		user.findOne({userName:req.body.userName},function(err,result){
 			if(err)
 			{
 				res.json({responseCode:400,responseMessage:"something went wrong"})
 			}
 			else
 			{
 				res.json({responseCode:200,responseMessage:"UserINFO HAS BEEN PROVIDED",result:result})
 			}
 		})
 	}
 }


 exports.savemsgdetails = function(req,res)
 {
 	var i=0;
 	if(!req.body)
 	{
 		res.json({responseCode:400,responseMessage:"please enter message"})
 	}
 	else
 	{
       user.findOne({userName:req.body.userName},function(err,data)
       {
       	if(err)
       	{
       		throw err
       	}

       
   else
   {
  
 	
   	console.log(req.body)
   	var Chat = new chat(req.body)
   	Chat.save(function(err,result)
   	{
   		if(err)
   		{
   			res.json({responseCode:400,responseMessage:"something went wrong"})
   		}
   		else
   		{
   			res.json({responseCode:200,responseMessage:" your message has been successfully send",result:result})
   		}
   	})
   }
 	})
 }
}