//user implementation
import express = require('express');
import usersservice = require('../../services/users/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { users: null };

export function list(req: express.Request, res: express.Response, next) {
    usersservice.listAll().then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listmore(req: express.Request, res: express.Response, next) {
    var question: any = {};
    var provider_name = req.header('Auth-Provider-Name');
    var auth_id = req.header('Auth-ID');
    if (provider_name && auth_id) {
        question.auth_provider_name = provider_name;
        question.auth_id = auth_id;
    }
    usersservice.listMore(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function set(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['providers'];
    if (fields(check)) {
        var question: any = {};
        var input = req.body;
        var provider_name = req.header('Auth-Provider-Name');
        var auth_id = req.header('Auth-ID');
        if (req.params.id) { question._id = req.params.id }
        usersservice.set(question, input).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function del(req: express.Request, res: express.Response, next) {
    var question: any = {};
    if (req.params.id) { question._id = req.params.id; }
    usersservice.del(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};