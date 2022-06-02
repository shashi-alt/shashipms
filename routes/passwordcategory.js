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

//     var perPage = 4;
//     var page = req.params.page || 1;

//     getaddpass.skip((perPage * page) - perPage)
//         .limit(perPage).exec(function (err, data) {

//             if (err) throw err;
//             passcatModel.countDocuments({}).exec((err, count) => {
//                 res.render('password_category', {
//                     title: 'Password management system',
//                     loginUser: loginUser,
//                     records: data,
//                     current: page,
//                     pages: Math.ceil(count / perPage)
//                 });
//             });
//         });
// });


// router.get('/:page', checkLoginUser, function (req, res, next) {
//     var loginUser = localStorage.getItem('loginUser');
//     var perPage = 4;
//     var page = req.params.page || 1;

//     getaddpass.skip((perPage * page) - perPage)
//         .limit(perPage).exec(function (err, data) {

//             if (err) throw err;
//             passcatModel.countDocuments({}).exec((err, count) => {
//                 res.render('password_category', {
//                     title: 'Password management system',
//                     loginUser: loginUser,
//                     records: data,
//                     current: page,
//                     pages: Math.ceil(count / perPage)
//                 });
//             });
//         });
// });


    getpassCat.exec(function (err, data) {
        if (err) throw err;
        res.render('password_category', { title: 'Password management system', loginUser: loginUser, records: data });
    });
});


router.get('/delete/:id', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var passdelete = passcatModel.findByIdAndDelete(passcat_id);
    passdelete.exec(function (err) {
        if (err) throw err;
        res.redirect('/passwordcategory');
    });
});



router.get('/edit/:id', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var getpassCategory = passcatModel.findById(passcat_id);
    getpassCategory.exec(function (err, data) {
        if (err) throw err;
        res.render('edit_passwordcategory', { title: 'Password management system', loginUser: loginUser, errors: '', success: '', records: data, id: passcat_id });
    });
});

router.post('/edit/', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.body.id;
    var passwordCategory = req.body.passwordCategory;
    var update_passcat = passcatModel.findByIdAndUpdate(passcat_id, { password_category: passwordCategory });
    update_passcat.exec(function (err, doc) {
        if (err) throw err;
        res.redirect('/passwordcategory');
    });
});

module.exports = router;