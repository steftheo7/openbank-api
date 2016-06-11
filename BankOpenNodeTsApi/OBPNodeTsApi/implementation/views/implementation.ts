// views implementation
import express = require('express');
import viewsservice = require('../../services/views/service');
import accountsservice = require('../../services/accounts/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { views: null };

export function reqview(req: express.Request, res: express.Response, next) {
    //console.log(req.params.id);
    var question: any = {};
    if (req.user) { question.user_id = { $in: [req.user.id] } };
    question.bank_id = req.params.bid;
    question._id = req.params.vid;
    viewsservice.reqView(question).then(
        function (resp) {
            if (resp['data']) { req.params.view = resp['data'] };
            next();
        }
    );
};
export function listbid(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    question.is_public = true;
    viewsservice.listBid(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listid(req: express.Request, res: express.Response, next) {
    //console.log(req.params.id);
    var question: any = {};
    question.bank_id = req.params.bid;
    question.account_id = req.params.acid;
    question._id = req.params.id;
    viewsservice.listId(question).then(
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
        if (req.body.id) { question._id = req.body.id; }
        viewsservice.listMore(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    var question: any = {};
    var input = req.body;
    //fixes for views
    for (var item in input) {
        if (item.search('can') > -1) { delete input[item] }
    }

    input.bank_id = req.params.bid;
    if (req.params.id) { question._id = req.params.id; }
    //if it is for a specific account
    if (req.params.acid) {
        var quest: any = {};
        quest._id = req.params.acid;
        accountsservice.listId(quest).then(function (resp) {
            //if account id found
            if (resp['data']) {
                //create view
                viewsservice.set(question, input).then(function (resp2) {
                    //if view created
                    if (resp2['data']) {
                        //take view id and..
                        var body = { $addToSet: { views_available: resp2['data'].id.toString() } }
                        //..add view id to account
                        accountsservice.setid(quest, body).then(function (resp3) {
                            if (resp3['data'])
                                commonfunct.response(resp2, name, res, next)
                            else
                                commonfunct.response(resp3, name, res, next)
                        });
                    }
                    else {
                        commonfunct.response(resp2, name, res, next)
                    }
                });
            }
            //else error message
            else {
                commonfunct.response(resp, name, res, next)
            }
        });
    }
    else {
        viewsservice.set(question, input).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            });
    }
};
export function del(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    if (req.params.id) { question._id = req.params.id; }
    if (req.params.acid && req.params.id) {
        var quest: any = {};
        quest._id = req.params.acid;
        quest.views_available = req.params.id;
        accountsservice.listId(quest).then(function (resp) {
            //if account id found
            if (resp['data']) {
                //delete view
                viewsservice.del(question).then(function (resp2) {
                    //if view created
                    if (resp2['data']) {
                        //take view id and..
                        var body = { $pull: { views_available: req.params.id } }
                        //..add view id to account
                        accountsservice.setid(quest, body).then(function (resp3) {
                            if (resp3['data'])
                                commonfunct.response(resp2, name, res, next)
                            else
                                commonfunct.response(resp3, name, res, next)
                        });
                    }
                    else {
                        commonfunct.response(resp2, name, res, next)
                    }
                });
            }
            //else error message
            else {
                commonfunct.response(resp, name, res, next)
            }
        });
    }
    else {
        viewsservice.del(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            });
    }
};