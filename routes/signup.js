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
}

router.get('/', function (req, res, next) {

    var loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
        res.redirect('./dashboard');
    } else {

        res.render('signup', { title: 'Password management system', msg: '' });
    }
});

router.post('/', checkusername, checkEmail, function (req, res, next) {
    var username = req.body.uname;
    var Email = req.body.Email;
    var password = req.body.password;
    var confpassword = req.body.confpassword

    // if (password != confpassword) {
    //   res.render('signup', { title: 'Password management system', msg: 'password not match' });

    // } else {

    password = bcrypt.hashSync(req.body.password, 10);
    var userDetails = new userModule({
        username: username,
        Email: Email,
        password: password,
    });
    userDetails.save((err, doc) => {
        if (err) throw err;
    });

    res.render('signup', { title: 'Password management system', msg: 'user registered successfully' });
    // };
});

module.exports = router;