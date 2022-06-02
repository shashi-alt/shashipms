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

router.get('/delete/:id', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var addpass_id = req.params.id;
    var passdelete = addpassModel.findByIdAndDelete(addpass_id);
    passdelete.exec(function (err) {
        if (err) throw err;
        res.redirect('/view-all-password');
    });
});

router.get('/', checkLoginUser, function (req, res, next) {
    res.redirect('/dashboard')
});


router.get('/edit/:id', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var addpass_id = req.params.id;
    var getaddpassedit = addpassModel.findById(addpass_id);
    getaddpassedit.exec(function (err, data) {
        if (err) throw err;
        getpassCat.exec(function (err, data1) {
            res.render('edit_password_detail', { title: 'Password management system', loginUser: loginUser, errors: '', success: '', records: data1, record: data, id: addpass_id });
        });
    });
});


router.post('/edit/:id', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var addpass_id = req.params.id;
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var password_detail = req.body.pass_detail;
    addpassModel.findByIdAndUpdate(addpass_id, { password_category: pass_cat, project_name: project_name, password_detail: password_detail }).exec(function (err) {
        if (err) throw err;
        var getaddpassedit = addpassModel.findById(addpass_id);
        getaddpassedit.exec(function (err, data) {
            if (err) throw err;
            getpassCat.exec(function (err, data1) {
                res.render('edit_password_detail', { title: 'Password management system', loginUser: loginUser, errors: '', success: 'Password Updated Successfully', records: data1, record: data, id: addpass_id });
            });
        });
    });
});


module.exports = router;