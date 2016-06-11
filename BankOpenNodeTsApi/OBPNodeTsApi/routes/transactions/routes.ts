/*
 Api routes 
 */
//this is an interface to take transactions
import passport = require('passport');
import transactions = require('../../implementation/transactions/implementation');
import views = require('../../implementation/views/implementation');
var router = require('express').Router();
var path = '/transactions';

/* Rest Api Full */
router.get('/banks/:bid/accounts/:acid/:vid/transactions/:id/transaction',
    passport.authenticate('custom'), views.reqview, transactions.list);
router.delete('/banks/:bid/accounts/:acid/:vid/transactions/:id/transaction',
    passport.authenticate('custom'), views.reqview, transactions.del);
router.get('/banks/:bid/accounts/:acid/:vid/transactions',
    passport.authenticate('custom'), views.reqview, transactions.listmore);
router.post('/banks/:bid/accounts/:acid/:vid/transactions',
    passport.authenticate('custom'), views.reqview, transactions.listmore);


module.exports = router;