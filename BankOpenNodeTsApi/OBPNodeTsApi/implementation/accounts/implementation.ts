//account implementation
import express = require('express');
import accountsservice = require('../../services/accounts/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { accounts: null };

export function getid(req: express.Request, res: express.Response, next) {
    if (req.params.IBAN) {
        var question: any = {};
        question.IBAN = req.params.IBAN.split(' ').join('');
        accountsservice.getId(question).then(function (resp) {
            commonfunct.response(resp, name, res, next)
        })
    }
    else {
        commonfunct.response(null, name, res, next)
    }
};
export function listbid(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['customer_id'];
    if (fields(check)) {
        var question: any = [{}];
        if (req.params.bid) {
            question[0].bank_id = req.params.bid;
            question[0].callfor = "bank";
            question[0].customer_id = commonfunct.bankpermissions(req).customer_id.toString();
        }
        else {
            question = commonfunct.bankscustomers(req);
            question.map(function (item) { item.callfor = "bankall"; })
        }
        accountsservice.listBid(question).then(function (resp) {
            commonfunct.response(resp, name, res, next)
        })
    }
};
export function listbidprivate(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['customer_id'];
    if (fields(check)) {
        var question: any = [{}];
        if (req.params.bid) {
            question[0].bank_id = req.params.bid;
            question[0].customer_id = commonfunct.bankpermissions(req).customer_id.toString();
            question[0].callfor = "private";
        }
        else {
            question = commonfunct.bankscustomers(req);
            question.map(function (item) { item.callfor = "private"; })
        }
        accountsservice.listBid(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function listbidpublic(req: express.Request, res: express.Response, next) {
    var question: any = [{}];
    if (req.params.bid) {
        question[0].bank_id = req.params.bid;
        question[0].callfor = "public";
    }
    else {
        question[0].callfor = "publicall";
    }
    accountsservice.listBid(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listidview(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    question._id = req.params.id;
    //question.owners = { $in: [commonfunct.bankpermissions(req).customer_id.toString()] };
    question.view = { id: req.params.vid };
    accountsservice.listIdView(question).then(function (resp) {
        if (req.params.scope && req.params.scope == 'views' && resp['data'] && resp['data'].views_available) {
            resp['data'] = resp['data'].views_available;
            commonfunct.response(resp, { views: null }, res, next)
        }
        else {
            commonfunct.response(resp, name, res, next)
        }
    });
};
export function listidviewpublic(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    question._id = req.params.id;
    question.is_public = true;
    question.rq = { view: { id: req.params.vid, is_public: true } };
    accountsservice.listIdView(question).then(function (resp) {
        if (req.params.scope && req.params.scope == 'views' && resp['data'] && resp['data'].views_available) {
            resp['data'] = resp['data'].views_available;
            commonfunct.response(resp, { views: null }, res, next)
        }
        else {
            commonfunct.response(resp, name, res, next)
        }
    });
};
export function listmore(req: express.Request, res: express.Response, next) {
    //params by default is those three paraments 
    var check = { field: [], params: [req, res, next] };
    check.field = ['data'];
    if (fields(check)) {
        var question: any = {};
        if (req.body.label) { question.label = commonfunct.customcontainsregexp(req.body.label); }
        if (req.body.type_id) { question.type = req.body.type_id; }
        if (req.body.IBAN) { question.IBAN = req.body.IBAN.split(' ').join(''); }
        if (req.params.id) { question._id = req.params.id; }
        if (req.params.bid) { question.bank_id = req.params.bid; }
        accountsservice.listMore(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};

//todo auth
export function set(req: express.Request, res: express.Response, next) {
    var question: any = {};
    var input = req.body;
    if (req.params.id) { question._id = req.params.id; }
    input.bank = req.params.bid;
    accountsservice.set(question, input).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function del(req: express.Request, res: express.Response, next) {
    var question: any = {};
    if (req.params.id) { question._id = req.params.id; }
    accountsservice.del(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};