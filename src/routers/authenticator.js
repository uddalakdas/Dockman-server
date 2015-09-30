var User = require('../models/User');
var debug = require('debug')('Dockman-server:router:authenticator');
var fbgraph = require('fbgraphapi');

module.exports = function(req, res, next) {
	var token = (req.query && req.query.access_token);
	console.log(token);
	if (token){
			User.findOne({"token":token},function(err,user){
				if(err){
					res.status(500).send('{"error":{"message":"Internal Server error","code":500}}');
				}
				else if(user){
					req.user = user;
					next();	
				}
				else
					res.status(401).send('{error:"No such user"}');
			});
	}else{
		return res.status(401).send('{error:"Authentication required"}');
	}
};