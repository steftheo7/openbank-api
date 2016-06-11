// transactionRequests implementation
import express = require('express');
import transactionRequestsservice = require('../../services/transactionRequests/service');
import transactionsservice = require('../../services/transactions/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
import accountsservice = require('../../services/accounts/service');
import Q = require('q');
var name = { 'transaction-requests': null };

export function list(req: express.Request, res: express.Response, next) {
    transactionRequestsservice.listAll().then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listmore(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['data'];
    if (fields(check)) {
        var question: any = {};
        if (req.body.uuid) { question.uuid = req.body.uuid; }
        if (req.params.id) { question._id = req.params.id; }
        transactionRequestsservice.listMore(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    function setRequest() {
        transactionRequestsservice.set(question, input).then(
            function (resp) {
                if (resp['data']) {
                    delete resp['data'].supported_challenge_types;
                }
                commonfunct.response(resp, name, res, next);
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
                if (resp2['error']) { commonfunct.response(resp2, name, res, next) }
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
                            if (transaction.this_account != transaction.this_account_insystem) { transaction.other_account = transaction.this_account };
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
    var check = { field: [], params: [req, res, next] };
    check.field = ['data', 'TransactionAccount'];
    if (fields(check)) {
        var question: any = {};
        var transaction: any = {};
        var input = req.body;
        var fromaccount: boolean, toacccount: boolean;
        input.resource_url = req.url;
        input.transaction_ids = [];
        transaction.details = {};
        transaction.details.posted_by_user_id = req.user.id.toString();
        transaction.details.posted_by_ip_address = req.ip;
        transaction.details.type = req.params.type;
        transaction.details.description = input.description;
        transaction.details.value = input.value;
        transaction.details.value.amount = -1 * transaction.details.value.amount;
        question.from = {};
        if (req.params.id) { question._id = req.params.id; };
        if (req.params.acid || input.from.account_id) {
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
                try { flag = resp['data'].views_available[0].can_initiate_transaction; } catch (err) { };
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
                else if (resp['error']) {
                    resp['error'] = resp['error'].toString() + " in Path From/Url";
                    commonfunct.response(resp, name, res, next)
                }
                else {
                    commonfunct.response(null, null, res, next)
                }
            });
        }
        else if (input.from.other_account_id) {
            transaction.this_account = input.from.account_id;
            input.from.account_id = input.from.other_account_id;
            fromaccount = true;
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
                        commonfunct.response(resp, name, res, next)
                    }
                }
                else {
                    resp['error'] = resp['error'].toString() + " in Path To";
                    commonfunct.response(resp, name, res, next)
                }
            });
        }
        else if (input.to.other_account_id) {
            transaction.other_account = input.to.other_account_id;
            input.to.account_id = input.to.other_account_id;
            toacccount = true;
        };
        Q.nextTick(transactionRequest);
    }
};