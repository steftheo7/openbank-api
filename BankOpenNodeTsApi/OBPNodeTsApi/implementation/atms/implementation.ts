// atms implementation
import express = require('express');
import atmsservice = require('../../services/atms/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { atms: null };

export function listbid(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    atmsservice.listBid(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listid(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    question._id = req.params.id;
    atmsservice.listId(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listmore(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field=['data'];
    if (fields(check)) {
        var question: any = {};
        if (req.body.city) { question.city = commonfunct.customcontainsregexp(req.body.city); }
        if (req.body.name) { question.name = commonfunct.customcontainsregexp(req.body.name); }
        if (req.params.id) { question._id = req.params.id; }
        if (req.params.bid) { question.bank_id = req.params.bid; }
        atmsservice.listMore(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field=['can_edit_atms'];
    if (fields(check)) {
        var question: any = {};
        var input = req.body;
        if (req.params.id) { question._id = req.params.id; }
        input.bank_id = req.params.bid;
        atmsservice.set(question, input).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function del(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field=['can_edit_atms'];
    if (fields(check)) {
        var question: any = {};
        if (req.params.id) { question._id = req.params.id; }
        atmsservice.del(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};