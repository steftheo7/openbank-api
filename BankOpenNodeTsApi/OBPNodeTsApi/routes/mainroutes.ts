import express = require('express');
import users = require('../implementation/users/implementation');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Hi. Welcome to the new Open Node Bank Api' });
});
/* GET home page. */
router.get('/Licence', function (req, res, next) {
    res.render('Licence');
});
router.get('/Register', function (req, res, next) {
    res.render('register');
});
router.post('/Register', function (req, res, next) {
    var input = req.body;
    if (JSON.stringify(input) !== "{}") {
        try { delete input.can_edit_banks; } catch (err) { };
        try { delete input.can_edit_users; } catch (err) { };
        var providers = [{ auth_provider_name: input.auth_provider_name, auth_id: input.auth_id }];
        var bank_permisions = [{
            bank_id: input.bank_id, customer_id: input.customer_id,
            can_edit_branches: input.can_edit_branches, can_edit_atms: input.can_edit_atms,
            can_edit_products: input.can_edit_products
        }];
        input.providers = providers;
        input.bank_permisions = bank_permisions;
        delete input.auth_provider_name;
        delete input.auth_id;
        delete input.bank_id;
        delete input.customer_id;
        delete input.can_edit_branches;
        delete input.can_edit_atms;
        delete input.can_edit_products;
        users.set(req, res, next);
    }
    else { res.status(412).send('No Input Data') }
});
//examples for cookies
//router.all('/setcookie', function (req, res, next) {
//    res.cookie('fakelogin', 'true', { maxAge: 900000, httpOnly: true });
//    res.render('index', { title: 'cookie that represents a connected user established' });
//});
//router.all('/clearcookie', function (req, res, next) {
//    res.clearCookie('fakelogin');
//    res.render('index', { title: 'Access cookie cleared' });
//});
// not in swagger
//router.all('/getcookie', function (req, res, next) {
//    console.log("Cookies: ", req.cookies.fakelogin);
//    res.render('index', { title: "cookie auth : "  + req.cookies.fakelogin });
//});

module.exports = router;
