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


module.exports = router;