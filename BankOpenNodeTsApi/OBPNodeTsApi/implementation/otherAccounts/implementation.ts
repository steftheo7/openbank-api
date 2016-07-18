// otherAccounts implementation
import express = require('express');
import otherAccountsservice = require('../../services/otherAccounts/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { otherAccounts: null };

export function listbid(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    otherAccountsservice.listBid(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listid(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    question._id = req.params.id;
    otherAccountsservice.listId(question).then(
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
        if (req.body.kind) { question.kind = commonfunct.customcontainsregexp(req.body.kind); }
        if (req.body.IBAN) { question.IBAN = req.body.IBAN.split(' ').join(''); }
        if (req.params.id) { question._id = req.params.id; }
        otherAccountsservice.listMore(question).then(
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
    input.bank = req.params.bid;
    otherAccountsservice.set(question, input).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        });
};
export function del(req: express.Request, res: express.Response, next) {
    var question: any = {};
    // like example new RegExp(req.body.name, "i") 
    if (req.params.id) { question._id = req.params.id; }
    otherAccountsservice.del(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        });
};