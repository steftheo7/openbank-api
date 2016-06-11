//customers implemantation
import express = require('express');
import customersservice = require('../../services/customers/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { customers: null };

export function listbid(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['can_edit_customers'];
    if (fields(check)) {
        var question: any = {};
        question.bank_id = req.params.bid;
        customersservice.listBid(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function listid(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['can_edit_customers'];
    if (fields(check)) {
        var question: any = {};
        question.bank_id = req.params.bid;
        question._id = req.params.id;
        customersservice.listId(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function listid2(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['customer_id'];
    if (fields(check)) {
        var question: any = {};
        question.bank_id = req.params.bid;
        question._id = commonfunct.bankpermissions(req).customer_id;
        customersservice.listId(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function listmore(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['data', 'can_edit_customers'];
    if (fields(check)) {
        var question: any = {};
        if (req.body.legal_name) { question.legal_name = commonfunct.customcontainsregexp(req.body.legal_name); }
        if (req.params.id) { question._id = req.params.id; }
        customersservice.listMore(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};

export function set(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['can_edit_customers'];
    if (fields(check)) {
        var question: any = {};
        var input = req.body;
        if (req.params.id) { question._id = req.params.id; }
        input.bank_id = req.params.bid;
        customersservice.set(question, input).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function del(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['can_edit_customers'];
    if (fields(check)) {
        var question: any = {};
        customersservice.del(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};