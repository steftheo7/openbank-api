/*
 Api routes 
 */
import passport = require('passport');
import accounts = require('../../implementation/accounts/implementation');
var router = require('express').Router();
var path = '/accounts';

/* Rest Api Full */
router.get(path + '/getid/:IBAN', accounts.getid);//listall
router.get(path, passport.authenticate('custom',
    { failureRedirect: '.' + path + '/public' }
), accounts.listbid);//listall
router.get(path + path + '/public', function (req, res) {
    res.redirect('./../public');
});
router.get(path + '/private', passport.authenticate('custom'), accounts.listbidprivate);//listall
router.get(path + '/public', accounts.listbidpublic);//listall

router.put('/banks/:bid' + path, passport.authenticate('custom'), accounts.set);//insert new bank
router.get('/banks/:bid' + path, passport.authenticate('custom',
    { failureRedirect: '.' + path + '/public' }
), accounts.listbid);//listall
router.get('/banks/:bid' + path + path + '/public', function (req, res) {
    res.redirect('./../public');
});
router.get('/banks/:bid' + path + '/private', passport.authenticate('custom'), accounts.listbidprivate);//listall
router.get('/banks/:bid' + path + '/public', accounts.listbidpublic);


router.get('/banks/:bid' + path + '/:id/:vid/account', passport.authenticate('custom',
    { failureRedirect: '.' + '/account/public' }
), accounts.listidview);//get by id
router.get('/banks/:bid' + path + '/:id/:vid/account/public', accounts.listidviewpublic);//get by id
router.get('/banks/:bid' + path + '/:id/:vid/account' + '/:scope', passport.authenticate('custom',
    { failureRedirect: '.' + '/account/public'}
), accounts.listidview);//get by id
router.get('/banks/:bid' + path + '/:id/:vid/account/account'+'/public', function (req, res) {
    res.redirect('./../public');
});
router.get('/banks/:bid' + path + '/:id/:vid/account/public' + '/:scope', accounts.listidviewpublic);//get by id

router.put('/banks/:bid' + path + '/:id', passport.authenticate('custom'), accounts.set);//update existing account
router.delete('/banks/:bid' + path + '/:id', passport.authenticate('custom'), accounts.del);//delete with id

module.exports = router;
