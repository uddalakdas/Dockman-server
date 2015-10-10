var User = require('../models/User');
var express = require('express');
var router = express.Router();
var debug = require('debug')('Dockman-server:router:users');
var formidable = require('formidable');
var dbController = require('../db/db-controller');
//var fs = require('fs-extra');

router.get('/:userId', function(req, res) {
  if(req.user && req.user.email==req.params.userId)
    res.send(req.user);
  else
    res.status(400).send('{error:"Cannot access user details"}');
});

router.post('/:userId/logout', function(req, res) {
  if(req.user && req.user.email==req.params.userId){
  	User.update({email:req.user.email},{token:null},{multi:false},function(err,numUpdated){
  		if(err || numUpdated==0) {
  			res.status(500).send('{error:"Cannot logout"}');
  		}
  		else {
  			res.status(200).send('{success:"Logged out successfully"}');
  		}
  	})
  }
  else
    res.status(400).send('{error:"Cannot access user details"}');
});

router.post('/:userId/documents', function (req,res) {
    //console.log(req.body);
    if(req.user && req.user.email==req.params.userId){
        var form = new formidable.IncomingForm();
        var imageReceived,metadata;
        var fileDetails={};

        form.on('file', function(name, file) {
                fileDetails.path = file.path;
                imageReceived = true;

        });
        form.on('field', function (name,value) {
           if(name=='metadata'){
               console.log(JSON.parse(value))
               metadata = JSON.parse(value);
           }
        });
        form.on('end',function(){
            console.log("Hi");
            if(imageReceived){
                fileDetails.name = metadata.name;
                fileDetails.metadata = metadata;
                dbController.create(fileDetails,function(err,file){
                    if(err){
                        console.log(err);
                        res.status(401).json({"status":401,"message":"Image not recieved"});
                    }
                    else{
                        req.user.documents.push(file._id);
                        User.update({email:req.user.email},{documents:req.user.documents},function(err,numUpdated){
                                if(err || numUpdated==0) {
                                    res.status(500).send('{error:"Cannot add document"}');
                                }
                                else {
                                    res.status(200).send('{success:"Document added successfully"}');
                                }
                        });
                    }

                });
            }
            else{
                console.log("error");
                res.status(401).json({"status":401,"message":"Image not recieved"});
            }

        });
        form.parse(req);
    }
})
router.get('/:userId/documents/:documentId', function(req, res) {
    if(req.user && req.user.email==req.params.userId) {
        if(req.user.documents.indexOf(req.params.documentId)>=0){
            dbController.read(req.params.documentId, function (err,file) {
                if(err){
                    res.status(400).send('{error:"Cannot access document"}');
                }
                else {
                    res.setHeader('Content-disposition', 'attachment; filename=' + file.name + ".jpg");
                    res.setHeader('Content-type', "image/jpg");
                    file.stream.pipe(res);
                }
            })
        }
        else
            res.status(400).send('{error:"No such document"}');
    }
    else
        res.status(400).send('{error:"Cannot access user details"}');
});
module.exports = router;