//bank implementation
import express = require('express');
import banksservice = require('../../services/banks/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { banks: null };

export function list(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    banksservice.listAll().then(
        function (resp) {
            params.resp = resp;
            commonfunct.response(params)
        }
    );
};
export function listid(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    var question: any = {};
    if (req.params.id) { question._id = req.params.id; }
    banksservice.listId(question).then(
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
        if (req.body.short_name) { question.short_name = commonfunct.customcontainsregexp(req.body.short_name); }
        if (req.body.full_name) { question.full_name = commonfunct.customcontainsregexp(req.body.full_name); }
        if (req.body.id) { question._id = req.body.id; }
        banksservice.listMore(question).then(
            function (resp) {
                params.resp = resp;
                commonfunct.response(params)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    var check = { field: [], params: {req, res, next} };
    check.field = ['can_add_bank', 'can_edit_banks'];
    if (fields(check)) {
        var question: any = {};
        var input = req.body;
        if (req.params.id) { question._id = req.params.id; }
        banksservice.set(question, input).then(
            function (resp) {
                params.resp = resp;
                commonfunct.response(params)
            }
        );
    }
};
export function del(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    var check = { field: [], params: {req, res, next} };
    check.field = ['can_edit_banks'];
    if (fields(check)) {
        var question: any = {};
        if (req.params.id) { question._id = req.params.id; }
        banksservice.del(question).then(
            function (resp) {
                params.resp = resp;
                commonfunct.response(params)
            }
        );
    }
};