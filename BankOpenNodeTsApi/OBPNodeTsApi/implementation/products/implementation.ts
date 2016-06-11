//product implementation
import express = require('express');
import productsservice = require('../../services/products/service');
import commonfunct = require('../../implementation/commonfunct');
var fields = commonfunct.check;
var name = { products: null };

export function listbid(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    productsservice.listBid(question).then(
        function (resp) {
            commonfunct.response(resp, name, res, next)
        }
    );
};
export function listid(req: express.Request, res: express.Response, next) {
    var question: any = {};
    question.bank_id = req.params.bid;
    question._id = req.params.id;
    productsservice.listId(question).then(
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
        if (req.body.name) { question.name = commonfunct.customcontainsregexp(req.body.name); }
        if (req.body.family) { question.family = commonfunct.customcontainsregexp(req.body.family); }
        if (req.params.id) { question._id = req.params.id; }
        if (req.params.bid) { question.bank_id = req.params.bid; }
        if (req.body.category) { question.category = req.body.category; }
        productsservice.listMore(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function set(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['can_edit_products'];
    if (fields(check)) {
        var question: any = {};
        var input = req.body;
        input.bank = req.params.bid;
        if (req.params.id) { question._id = req.params.id; }
        productsservice.set(question, input).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};
export function del(req: express.Request, res: express.Response, next) {
    var check = { field: [], params: [req, res, next] };
    check.field = ['can_edit_products'];
    if (fields(check)) {
        var question: any = {};
        if (req.params.id) { question._id = req.params.id; }
        productsservice.del(question).then(
            function (resp) {
                commonfunct.response(resp, name, res, next)
            }
        );
    }
};