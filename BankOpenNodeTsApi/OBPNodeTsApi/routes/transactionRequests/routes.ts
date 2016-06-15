/*
 Api routes 
 */
//this is an interface to take transactions
import passport = require('passport');
import transactionRequest = require('../../implementation/transactionRequests/implementation');
var router = require('express').Router();
var path = '/transactionRequest';

/* Rest Api Full */
router.get('/banks/:bid/accounts/:acid/:vid/transaction-requests',
    passport.authenticate('custom'), transactionRequest.list);
//router.get('/banks/:bid/accounts/:acid/:vid/transaction-request-types',
//    passport.authenticate('custom'), transactionRequest.listmore);
router.put('/banks/:bid/transaction-request-types/:type/transaction-requests',
    passport.authenticate('custom'), transactionRequest.set);
router.put('/banks/:bid/accounts/:acid/:vid/transaction-request-types/:type/transaction-requests',
    passport.authenticate('custom'), transactionRequest.set);

module.exports = router;