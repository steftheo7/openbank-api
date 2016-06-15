import express = require('express');
import config = require('config');
var router = express.Router();
var isAuthenticated = require('../isAuthenticated');
import usersservice = require('../services/users/service');
import usersmodels = require('../models/users/model');
//import requestIp = require('request-ip');
export import passport = require('passport');
router.all('/logincheck', passport.authenticate('custom'), function (req: any, res, next) {
    res.json('sucessfull');
});

router.post('/login', passport.authenticate('custom'), function (req: any, res, next) {
    res.json('sucessfull');
});
//examples for cookies
router.all('/setcookie', passport.authenticate('custom'), function (req, res, next) {
    if (req.header('Auth-Provider-Name') && req.header('Auth-ID'))
    {
    res.cookie('AuthProviderName', req.header('Auth-Provider-Name'), { maxAge: 100000, httpOnly: true });
    res.cookie('AuthID', req.header('Auth-ID'), { maxAge: 100000, httpOnly: true });
    res.render('index', { title: 'cookie that represents a connected user established' });
    }
    else
    {
        res.render('index', { title: 'cookie need auth headers ' });
    }
});
router.all('/clearcookie', function (req, res, next) {
    res.clearCookie('AuthProviderName');
    res.clearCookie('AuthID');
    res.render('index', { title: 'Access cookie cleared' });
});
// not in swagger
//router.all('/getcookie', function (req, res, next) {
//    console.log("Cookies: ", req.cookies.fakelogin);
//    res.render('index', { title: "cookie auth : "  + req.cookies.fakelogin });
//});
module.exports = router;