var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passcatModel = require('../modules/password_category');
var addpassModel = require('../modules/addpassword');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { check, validationResult } = require('express-validator');
var getpassCat = passcatModel.find({});
var getaddpass = addpassModel.find({});
// GET home page.

function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch (err) {
    res.redirect('/');
  }
  next();
}


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



function checkusername(req, res, next) {
  var uname = req.body.uname;
  var checkexitusername = userModule.findOne({ username: uname });
  checkexitusername.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'Password Management System', msg: 'Username already exit.' });
    }
    next();
  });
}

function checkEmail(req, res, next) {
  var Email = req.body.Email;
  var checkexitEmail = userModule.findOne({ Email: Email });
  checkexitEmail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'Password Management System', msg: 'Email already exit.' });
    }
    next();
  });
};


router.get('/', function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('./dashboard');
  } else {
    res.render('index', { title: 'Password management system', msg: '' });
  }
});
router.post('/', function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModule.findOne({ username: username });
  checkUser.exec((err, data) => {

    if (data == null) {
      res.render('index', { title: 'Password management system', msg: 'You are Not a Registered User Please Register First' });
    } else {

      if (err) throw err;
      var getUserID = data._id;
      var getPassword = data.password;
      if (bcrypt.compareSync(password, getPassword)) {
        var token = jwt.sign({ userID: getUserID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        res.redirect('/dashboard');
      } else {
        res.render('index', { title: 'Password management system', msg: 'invalid user name and password' });
      }
    }
  });
});

module.exports = router;
