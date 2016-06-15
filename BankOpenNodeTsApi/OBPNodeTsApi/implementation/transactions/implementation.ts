// transactions implementation
import express = require('express');
import transactionsservice = require('../../services/transactions/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var viewfields = commonfunct.viewfields;
import accountsservice = require('../../services/accounts/service');
import Q = require('q');
var name = { transactions: null };

export function list(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['view_id'];
    if (fields(check)) {
        var question: any = {};
        question.this_account = req.params.acid;
        question.view = viewfields(req.params.view, 'transaction');
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
        //for (var a in view) { view[a] = true; };//testing purpose
        obp.view = viewfields(req.params.view, 'transaction');

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
export function listscope(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['view_id'];
    if (fields(check)) {
        var question: any = {};
        question.this_account = req.params.acid;
        question.view = viewfields(req.params.view, 'transaction');
        if (req.params.id) { question._id = req.params.id };
        transactionsservice.list(question).then(
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
    if (req.params.id) { question._id = req.params.id; }
    transactionsservice.del(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        });
};