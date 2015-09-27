var User = require('../models/User');
var debug = require('debug')('Dockman-server:router:authenticator');
var fbgraph = require('fbgraphapi');

module.exports = function(req, res, next) {
	var token = (req.query && req.query.access_token);
	console.log(token);
	if (token) {
			var fb = new fbgraph.Facebook(token,'v2.2');
			fb.me(function (err,response) {
				if(err){
					res.status(500).send('{"error":{"message":"Internal Server error","code":500}}');
				}
				else if(response.error){
					res.status(401).send('{error:"No such user"}');
				}
				else{
					User.findOne({email:response.email},function(err,user){
						if(err){
							res.status(500).send('{"error":{"message":"Internal Server error","code":500}}');
						}
						else if(user){
							req.user = user;
							next();	
						}
						else
							res.status(401).send('{error:"No such user"}');
					})
						
				}
			});
	}else{
		return res.status(401).send('{error:"Authentication required"}');
	}
};