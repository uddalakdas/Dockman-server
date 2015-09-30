var User = require('../models/User');
var express = require('express');
var router = express.Router();
var debug = require('debug')('Dockman-server:router:users');

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
module.exports = router;