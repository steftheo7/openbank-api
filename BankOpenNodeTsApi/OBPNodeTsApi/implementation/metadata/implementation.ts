//metadatas implemantation
import express = require('express');
import metadatasservice = require('../../services/metadata/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { metadata: null };

export function list(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    metadatasservice.listAll().then(
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
        if (req.body.id) { question._id = req.body.id; }
        metadatasservice.listMore(question).then(
            function (resp) {
                params.resp = resp;
                commonfunct.response(params)
            }
        );
    }
};
export function get(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    var check = { field: [], params: {req, res, next} };
    check.field = ['data'];
    if (fields(check)) {
        var question: any = {};
        if (req.body.id) { question._id = req.body.id; }
        metadatasservice.list(question).then(
            function (resp) {
                params.resp = resp;
                commonfunct.response(params)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    var question: any = {};
    if (req.params.id) { question._id = req.params.id; }
    metadatasservice.set(question, req.body).then(
        function (resp) {
            params.resp = resp;
            commonfunct.response(params)
        }
    );
};
export function del(req: express.Request, res: express.Response, next) {
    var params = { resp: null, name, res, next };
    var question: any = {};
    // like example new RegExp(req.body.name, "i")
    if (req.params.id) { question._id = req.params.id; }
    metadatasservice.del(question).then(
        function (resp) {
            params.resp = resp;
            commonfunct.response(params)
        }
    );
};