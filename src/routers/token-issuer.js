var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var secret = require('../config/secret');
var User = require('../models/User');
var debug = require('debug')('Dockman-server:router:token-issuer');
var fbgraph = require('fbgraphapi');

router.post('/fb', function (req, res) {
    var token = (req.query && req.query.access_token);
    if(token){
        handleFBAuthentication(token,function(err,fbUser){
            if(err){
                console.log(err);
                res.status(401).send(err);
            }
            else{
               handleLocalAuthentication(req,res,fbUser,token);
            }
        });
    }
    else{
        return res.status(401).send('{error:"Authentication required"}');
    }
});

router.post('/google',function (req,res){
    var token = (req.query && req.query.access_token);
    if(token){
        handleGoogleAuthentication(token,function(err,googleUser){
            if(err){
                console.log(err);
                res.status(401).send(err);
            }
            else
                handleLocalAuthentication(req,res,googleUser);
        });
    }
    else{
        return res.status(401).send('{error:"Authentication required"}');
    }
});
var handleFBAuthentication = function(token,callback){
    var fb = new fbgraph.Facebook(token,'v2.2');
    fb.me(function(err,user){
        console.log(user);
        if(err)
            return callback(err,null);
        else if(user.error)
            return callback(user,null);
        else
            return callback(null,user);
    });
}
var handleGoogleAuthentication = function(token,callback){

}
var handleLocalAuthentication = function(req,res,externalUser,token){
     
     User.findOne({email:externalUser.email},function(err,userDetails){
        console.log("Step2");
        if(err){
            console.log(err);
            res.status(500).send('{"error":{"message":"Internal Server error","code":500}}');
        }
        else if(userDetails){
            console.log("Step4");
            //console.log(user)
            var user = {};
            user.email = userDetails.email;
            user.name = userDetails.name;
            user.token = jwt.encode(token,secret.jwtTokenSecret);
            res.send(user);  
        }
        else{
           
            var newUser = new User();
            
            newUser.name = externalUser.name;
            newUser.email = externalUser.email;
            newUser.token = jwt.encode(token,secret.jwtTokenSecret);
            
            newUser.save(function(err){
                if(err){
                    console.log("Step5");
                    console.log(err);
                    res.status(500).send('{"error":{"message":"Internal Server error","code":500}}');
                }
                else{
                    console.log("Step6");
                    res.send(newUser);
                }
                
            });
        }
    });
}
module.exports = router;