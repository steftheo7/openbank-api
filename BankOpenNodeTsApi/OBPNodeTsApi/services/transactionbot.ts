//other api data 
import Q = require('q');
import mongoose = require('mongoose');
import transactionsmodels = require('../models/transactions/model');
import accountsservice = require('../services/accounts/service');
import transactionsservice = require('../services/transactions/service');
import commonservice = require('../services/commonservice');
var async = require('async');
var transactionmodel = transactionsservice.transactionmodel;

export function set() {
    console.log('start transaction');
    var transactionReqArray = [];
    var i: number = 0;
    var string: any = { 'details.status': 'DRAFT' };
    var thetransaction = mongoose.model('transaction', transactionmodel._schema);
    thetransaction.find(string).lean()
        .populate('this_account', '_id') // only works if we pushed refs to children
        .exec(function (err, found: transactionsmodels.transactiondef[]) {
            found.forEach(function (transactiondraft, index) {
                if (i == index) {
                    i++;
                    var newBalance = transactiondraft['details'].value.amount;
                    var this_account: any = { _id: transactiondraft.this_account._id, $isolated: 1 };
                    //if (newBalance > 0) { this_account.owners = { $in: [transactiondraft.details.posted_by_user_id] }; };

                    transactiondraft.details.cancelled_by_ip_address = "68.180.194.242";
                    transactiondraft.details.cancelled_by_user_id = mongoose.mongo.ObjectId('0710bba5d46604e4072d1e73');

                    if (transactiondraft.transactionRequest) {
                        var other_account: any = { _id: transactiondraft.other_account_insystem, $isolated: 1 };
                        //if (newBalance < 0) { other_account.owners = { $in: [transactiondraft.details.posted_by_user_id] }; };

                        var temp = transactiondraft.transactionRequest.toString();
                        //to avoid second change from other_account for the same account
                        if (transactionReqArray.indexOf(temp) > -1) {
                            newBalance = 0;
                        }
                        else {
                            console.log('start account');
                            transactionReqArray.push(temp);
                        }
                        async.parallel([
                            function (callback) {
                                setTimeout(function () {
                                    accountsservice.setamount(this_account, newBalance).then(function (respfrom) {
                                        if (respfrom['data']) {
                                            transactiondraft.details.new_balance = {
                                                currency: transactiondraft.details.value.currency,
                                                amount: respfrom['data'].balance.amount
                                            };
                                            transactiondraft.details.description = "Transaction OK";
                                            transactiondraft.details.status = "COMPLETED";
                                            transactiondraft.details.completed = new Date().toISOString();
                                            callback(null, true);
                                        }
                                        else {
                                            transactiondraft.details.description = "Account Problem";
                                            transactiondraft.details.status = "CANCELLED";
                                            transactiondraft.details.completed = new Date().toISOString();
                                            callback(null, 'fromaccounterror');
                                        }
                                    });
                                }, 200);
                            },
                            function (callback) {
                                setTimeout(function () {
                                    console.log(other_account._id.toString());
                                    accountsservice.setamount(other_account, -1 * newBalance).then(function (respto) {
                                        if (respto['data']) {
                                            callback(null, true);
                                        }
                                        else {
                                            transactiondraft.details.description = "Account Problem";
                                            transactiondraft.details.status = "CANCELLED";
                                            transactiondraft.details.completed = new Date().toISOString();
                                            callback(null, 'toaccounterror');
                                        }
                                    });
                                }, 200);
                            }], function (err, result) {
                                if (result == 'fromaccounterror') {
                                    accountsservice.setamount(other_account, newBalance);
                                }
                                else if (result == 'toaccounterror') {
                                    accountsservice.setamount(this_account, -1 * newBalance);
                                }
                                else {
                                    transactionsservice.set(transactiondraft._id, transactiondraft);
                                }
                            });
                    }
                    else if (transactiondraft.this_account && !transactiondraft.transactionRequest) {
                        async.waterfall([
                            function (callback) {
                                accountsservice.setamount(this_account, newBalance).then(function (resp) {
                                    if (resp['data']) {
                                        transactiondraft.details.new_balance = {
                                            currency: transactiondraft.details.value.currency,
                                            amount: resp['data'].balance.amount
                                        };
                                        transactiondraft.details.description = "Transaction OK";
                                        transactiondraft.details.status = "COMPLETED";
                                        transactiondraft.details.completed = new Date().toISOString();
                                        transactionsservice.set(transactiondraft._id, transactiondraft);
                                        callback(null, "ok");
                                    }
                                    else {
                                        transactiondraft.details.description = "Account Problem";
                                        transactiondraft.details.status = "CANCELLED";
                                        transactiondraft.details.completed = new Date().toISOString();
                                        transactionsservice.set(transactiondraft._id, transactiondraft);
                                        callback(null);
                                    }
                                });
                            }], function (err, result) {
                                transactionsservice.set(transactiondraft._id, transactiondraft);
                            });
                    }
                }
            });
            console.log('end transaction');
        });

}