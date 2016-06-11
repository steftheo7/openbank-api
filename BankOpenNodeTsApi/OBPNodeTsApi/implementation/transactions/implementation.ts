// transactions implementation
import express = require('express');
import transactionsservice = require('../../services/transactions/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
import accountsservice = require('../../services/accounts/service');
import Q = require('q');
var name = { transactions: null };
function viewfields(view, params) {
    params.transaction = {
        _id: 1, uuid: 1, 'details.status': 1, 'details.description': 1, 'details.posted_by_user_id': 1, 'details.approved_by_user_id': 1, 'details.paused_by_user_id': 1,
        'details.cancelled_by_user_id': 1, 'details.posted_by_ip_address': 1, 'details.approved_by_ip_address': 1, 'details.paused_by_ip_address': 1, 'details.cancelled_by_ip_address': 1,
        'details.value': 1, 'details.new_balance.currency': 0, 'details.new_balance.amount': 0, 'details.type': 0, 'details.posted': 0, 'details.completed': 0
    }
    params.this_account = { _id: 1 };
    params.other_account = { _id: 1 };

    if (view.can_see_transaction_this_bank_account) { params.transaction.this_account = 1 };
    if (view.can_see_transaction_other_bank_account) { params.transaction.other_account = 1; params.transaction.other_account_insystem = 1 };
    if (view.can_see_transaction_metadata) { params.transaction.metadata = 1 };
    if (view.can_see_transaction_label) { };
    if (view.can_see_transaction_balance && view.can_see_transaction_currency) { params.transaction['details.new_balance.currency'] = 1 } else { delete params.transaction['details.new_balance.currency'] };
    if (view.can_see_transaction_balance && view.can_see_transaction_amount) { params.transaction['details.new_balance.amount'] = 1 } else { delete params.transaction['details.new_balance.amount'] };
    if (view.can_see_transaction_type) { params.transaction['details.type'] = 1 } else { delete params.transaction['details.type'] };;
    if (view.can_see_transaction_start_date) { params.transaction['details.posted'] = 1 } else { delete params.transaction['details.posted'] };;
    if (view.can_see_transaction_finish_date) { params.transaction['details.completed'] = 1 } else { delete params.transaction['details.completed'] };;

    if (view.can_see_bank_account_owners) { params.this_account.owners = 1 };
    if (view.can_see_bank_account_number) { params.this_account.number = 1 };
    if (view.can_see_bank_account_type) { params.this_account.type = 1 };
    if (view.can_see_bank_account_iban) { params.this_account.IBAN = 1 };
    if (view.can_see_bank_account_swift_bic) { params.this_account.swift_bic = 1 };
    if (view.can_see_bank_account_national_identifier) { params.this_account.bank_id = 1 };

    if (view.can_see_other_account_owners) { params.other_account.owners = 1 };
    if (view.can_see_other_account_number) { params.other_account.number = 1 };
    if (view.can_see_other_account_type) { params.other_account.type = 1 };
    if (view.can_see_other_account_iban) { params.other_account.IBAN = 1 };
    if (view.can_see_other_account_swift_bic) { params.other_account.swift_bic = 1 };
    if (view.can_see_other_account_national_identifier) { params.other_account.bank_id = 1 };
    return params;
}
export function list(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['view_id'];
    if (fields(check)) {
        var question: any = {};
        question.this_account = req.params.acid;
        question.view = req.params.view;
        if (req.params.id) { question._id = req.params.id };
        transactionsservice.list(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function listmore(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['view_id'];
    if (fields(check)) {
        var question: any = {};
        var obp: any = { sort_by: 'COMPLETED', sort_direction: -1, limit: 50, offset: 0, view: {} };
        var view = req.params.view;
        //for (var a in view) { view[a] = true; };//testing purpose
        obp.view = viewfields(view, obp.view);

        if (req.params.obp_sort_by) { obp.sort_by = req.params.obp_sort_by.toUpperCase() };
        try { if (req.params.obp_sort_direction.toUpperCase() == 'ASC') { obp.sort_direction = 1 }; } catch (err) { };
        if (req.params.obp_limit) { obp.limit = req.params.obp_limit };
        if (req.params.obp_offset) { obp.offset = req.params.obp_offset };
        if (req.params.obp_from_date || req.params.obp_to_date) {
            question.createdAt = {};
            if (req.params.obp_from_date) question.createdAt.$gte = req.params.obp_from_date.toISOString();
            if (req.params.obp_to_date) question.createdAt.$lt = req.params.obp_to_date.toISOString();
        }
        question.this_account = req.params.acid;

        if (req.params.id) { question._id = req.params.id; }
        transactionsservice.listMore(question, obp).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    var question: any = {};
    var input = req.body;
    if (req.params.id) { question._id = req.params.id; }
    transactionsservice.set(question, input).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        });
};
export function del(req: express.Request, res: express.Response, next) {
    var question: any = {};
    // like example new RegExp(req.body.name, "i") 
    if (req.params.id) { question._id = req.params.id; }
    transactionsservice.del(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        });
};