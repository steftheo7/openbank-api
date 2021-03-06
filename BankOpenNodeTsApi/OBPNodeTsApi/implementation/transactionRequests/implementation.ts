// transactionRequests implementation
import express = require('express');
import transactionRequestsservice = require('../../services/transactionRequests/service');
import transactionsservice = require('../../services/transactions/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
import accountsservice = require('../../services/accounts/service');
import otheraccountsservice = require('../../services/otherAccounts/service');
import Q = require('q');
var name = { 'transaction-requests': null };

export function list(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    transactionRequestsservice.listAll().then(
        function (resp) {
            params.resp = resp;
            commonfunct.response(params)
        }
    );
};
export function listmore(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    var check = { field: [], params: {req, res, next} };
    check.field = ['data'];
    if (fields(check)) {
        var question: any = {};
        if (req.body.uuid) { question.uuid = req.body.uuid; }
        if (req.params.id) { question._id = req.params.id; }
        transactionRequestsservice.listMore(question).then(
            function (resp) {
                params.resp = resp;
                commonfunct.response(params)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    function setRequest() {
        input.end_date = new Date().toISOString();
        transactionRequestsservice.set(question, input).then(
            function (resp) {
                if (resp['data']) {
                    delete resp['data'].supported_challenge_types;
                }
                params.resp = resp;
                commonfunct.response(params)
            });
    }
    function transactionRequest() {
        if (fromaccount && toacccount) {
            fromaccount = false;
            toacccount = false;
            var otheraccount: Boolean = false;
            transaction.details.posted = new Date().toISOString();
            //missing code for challange check
            transactionRequestsservice.set(question, input).then(function (resp2) {
                if (resp2['error']) {
                    var params = { resp2, name, res, next };
                    commonfunct.response(params)
                }
                else {
                    question._id = resp2['data'].id.toString();
                    input.status = 'COMPLETED';
                    if (input.status == 'COMPLETED') {
                        if (transaction.this_account_insystem) {
                            if (transaction.other_account_insystem)
                            { transaction.transactionRequest = resp2['data'].id.toString(); }
                            transaction.this_account = transaction.this_account_insystem;
                            transactionsservice.set(null, transaction).then(
                                function (resp) {
                                    input.transaction_ids.push(resp['data'].id.toString());
                                    if (!otheraccount) {
                                        input.value.amount = -1 * input.value.amount;
                                        Q.nextTick(setRequest);
                                    }
                                });
                        };
                        if (transaction.other_account_insystem) {
                            otheraccount = true;
                            transaction.details.value.amount = -1 * input.value.amount;
                            if (transaction.this_account != transaction.this_account_insystem)
                            { transaction.other_account = transaction.this_account };
                            transaction.this_account = transaction.other_account_insystem;
                            transaction.other_account_insystem = transaction.this_account_insystem;
                            transactionsservice.set(null, transaction).then(
                                function (resp) {
                                    input.transaction_ids.push(resp['data'].id.toString());
                                    Q.nextTick(setRequest);
                                });
                        };
                    }
                    else { setRequest() };
                };
            });
        }
    }
    var check = { field: [], params: {req, res, next} };
    check.field = ['data', 'TransactionAccount'];
    if (fields(check)) {
        var question: any = {};
        var transaction: any = {};
        var input = req.body;
        var fromaccount: boolean, toacccount: boolean;
        input.resource_url = '/api' + req.url;
        input.transaction_ids = [];
        transaction.details = {};
        transaction.details.posted_by_user_id = req.user.id.toString();
        transaction.details.posted_by_ip_address = req.ip;
        transaction.details.type = req.params.type;
        transaction.details.description = input.description;
        transaction.details.value = input.value;
        transaction.details.value.amount = -1 * transaction.details.value.amount;

        if (req.params.id) { question._id = req.params.id; };
        if (req.params.acid || input.from.account_id) {
            question.from = {};
            var temp: any = {};
            if (req.params.acid) {
                temp.bank_id = req.params.bid;
                temp.account_id = req.params.acid;
                question.from.views_available = req.params.vid;
            }
            else {
                temp.bank_id = input.from.bank_id;
                temp.account_id = input.from.account_id;
            }

            input.bank_id = temp.bank_id;
            input.account_id = temp.account_id;
            question.from.bank_id = temp.bank_id;
            question.from._id = temp.account_id;
            accountsservice.listId(question.from).then(function (resp) {
                var flag: boolean;
                try {
                    resp['data'].views_available.forEach(function (view) {
                        if (view.id == req.params.vid) {
                            flag = view.can_initiate_transaction;
                        }
                    });
                } catch (err) { };
                if (!flag) {
                    check.field = ['can_add_all_transactions_for_banks'];
                    if (fields(check)) { flag = true };
                };
                if (flag && resp['data']) {
                    fromaccount = true;
                    transaction.this_account_insystem = temp.account_id;
                    delete question.from;
                    Q.nextTick(transactionRequest);
                }
                else {
                    otheraccountsservice.listId(question.from._id).then(function (resp) {
                        //fuction for outsystem account
                        if (resp['data']) {
                            fromaccount = true;
                            transaction.this_account = temp.account_id;
                            delete question.from;
                            Q.nextTick(transactionRequest);
                        }
                        else {
                            resp['error'] = "Account not Exist in Path From/Url";
                            params.resp = resp;
                            commonfunct.response(params)
                        }
                    });
                }
            });
        };

        if (input.to.account_id) {
            question.to = {};
            question.to._id = input.to.account_id;
            question.to.bank_id = input.to.bank_id;
            accountsservice.listId(question.to).then(function (resp) {
                if (resp['data']) {
                    if (input.value.currency == resp['data'].balance.currency) {
                        toacccount = true;
                        transaction.other_account_insystem = input.to.account_id;
                        delete question.to;
                        Q.nextTick(transactionRequest);
                    }
                    else {
                        delete resp['data'];
                        resp = { error: 'Currency Not Same', status: 400 };
                        params.resp = resp;
                        commonfunct.response(params)
                    }
                }
                else {
                    otheraccountsservice.listId(question.to._id).then(function (resp) {
                        if (resp['data']) {
                            toacccount = true;
                            transaction.other_account = input.to.account_id;
                            delete question.to;
                            Q.nextTick(transactionRequest);
                        }
                        else {
                            resp['error'] = "Account not Exist in Path To";
                            params.resp = resp;
                            commonfunct.response(params)
                        }
                    });
                }
            });
        };
        Q.nextTick(transactionRequest);
    }
};