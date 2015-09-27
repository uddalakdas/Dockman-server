var User = require('../models/User');
var express = require('express');
var router = express.Router();
var debug = require('debug')('Dockman-server:router:fb-user');
var https = require('https');
var fbgraph = require('fbgraphapi');

router.post('/', function(req, res) {
	var token = (req.query && req.query.access_token);
	if(token){
		var fb = new fbgraph.Facebook(token,'v2.2');
		fb.me(function (err,response) {
    		console.log(response);
		 	if(response.email){
		 		console.log("Step1");
				User.findOne({email:response.email},function(err,user){
	      			console.log("Step2");
	      			if(err){
	      				console.log(err);
	        			res.status(500).send('{"error":{"message":"Internal Server error","code":500}}');
	      			}
	      			else if(user){
	      				console.log("Step4");
	      				console.log(user)
	        			res.send(user);
	      			}
	      			else{
	      				console.log("Step3");
	        			user = new User();
	        			user.name = response.name;
	        			user.email = response.email;
	        			user.save(function(err){
	        				if(err){
	        					console.log(err);
	        					res.status(500).send('{"error":{"message":"Internal Server error","code":500}}');
	        				}
	        				else{
	        					res.send(user);
	        				}
	        			});
	      			}
  				});
			}
			else{
				console.log(response);
				res.status(401).send(response.error);
			}
		})
	}
	else{
		return res.status(401).send('{error:"Authentication required"}');
	}
});
module.exports = router;