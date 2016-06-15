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
router.get('/banks/:bid/accounts/:acid/:vid/transactions',
    passport.authenticate('custom'), views.reqview, transactions.listmore);
router.get('/banks/:bid/accounts/:acid/:vid/transactions/:id/transaction',
    passport.authenticate('custom'), views.reqview, transactions.list);
    /*
router.get('/banks/:bid/accounts/:acid/:vid/transactions/:id/metadata/:scope',
    passport.authenticate('custom'), views.reqview, transactions.listscope);
router.put('/banks/:bid/accounts/:acid/:vid/transactions/:id/metadata/:scope',
    passport.authenticate('custom'), views.reqview, transactions.set);
router.delete('/banks/:bid/accounts/:acid/:vid/transactions/:id/metadata/:scope',
    passport.authenticate('custom'), views.reqview, transactions.del);
router.delete('/banks/:bid/accounts/:acid/:vid/transactions/:id/metadata/:scope/:scopeid',
    passport.authenticate('custom'), views.reqview, transactions.del);
//router.delete('/banks/:bid/accounts/:acid/:vid/transactions/:id/transaction',
//    passport.authenticate('custom'), views.reqview, transactions.del);
*/
module.exports = router;