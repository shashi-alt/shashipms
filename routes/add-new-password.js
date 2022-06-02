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

router.get('/', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    getpassCat.exec(function (err, data) {
        if (err) throw err;
        res.render('addNewpassword', { title: 'Password management system', loginUser: loginUser, records: data, success: "" });
    });
});

router.post('/', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
    var password_details = new addpassModel({
        password_category: pass_cat,
        project_name: project_name,
        password_detail: pass_details
    });
    password_details.save(function (err, doc) {
        getpassCat.exec(function (err, data) {
            if (err) throw err;
            res.render('addNewpassword', { title: 'Password management system', loginUser: loginUser, records: data, success: "Password Details Inserted Successfully" });
        });
    });
});

module.exports = router;