//mongo data 
import Q = require('q');
import mongoose = require('mongoose');
import accountsmodels = require('../../models/accounts/model');
import commonservice = require('../../services/commonservice');
var accountmodel = new accountsmodels.account();
var async = require('async');
var name = 'Account';

function checkview(schemaView, rqview) {
    function change(ret) {
        ret.views_available.forEach(function (view, index) {
            //console.log("viewid", index);
            if (view.id == rqview.id) {
                if (!view.can_see_bank_account_balance && !view.can_see_bank_account_currency) { delete ret.balance; }
                if (!view.can_see_bank_account_balance && view.can_see_bank_account_currency) { delete ret.balance.amount; }
                //if (!view.can_see_bank_account_bank_name){delete ret.bank;}
                if (!view.can_see_bank_account_iban) { delete ret.IBAN; }
                if (!view.can_see_bank_account_label) { delete ret.label; }
                //if (!view.can_see_bank_account_national_identifier){delete ret.national_identifier;}
                if (!view.can_see_bank_account_number) { delete ret.number; }
                if (!view.can_see_bank_account_owners) { delete ret.owners; }
                if (!view.can_see_bank_account_swift_bic) { delete ret.swift_bic; }
                if (!view.can_see_bank_account_type) { delete ret.type; }
            }
            else { delete ret.views_available[index] }
        });
    }
    if (schemaView) {
        if (schemaView.constructor === Object) { change(schemaView); }
        else { schemaView.map(function (ret) { change(ret); }); }
    }
    return schemaView;
}
//Transform
export function transform(schema) {
    function change(ret) {
        try { ret.balance.amount = parseFloat((ret.balance.amount / 100).toFixed(2)); } catch (err) { };
        try {
            ret.views_available.map(
                function (ret2) {
                    ret2.id = ret2._id.toString();
                    delete ret2._id;
                    delete ret2.__v;
                    delete ret2.createdAt;
                    delete ret2.updatedAt;
                })
        } catch (err) { };
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
    }
    if (schema) {
        if (schema.constructor === Object) { change(schema); }
        else { schema.map(function (ret) { change(ret); }); }
    }
    return schema;
};
export function getId(string: string) {
    var deferred = Q.defer();
    var theaccount = mongoose.model('account', accountmodel._schema);
    theaccount.findOne(string).lean()
        .select('_id bank_id')
        .exec(function (err, found) {
            try {
                found.id = found._id;
                delete found._id;
            } catch (err) { };
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listBid(json: any) {
    var deferred = Q.defer();
    var theaccount = mongoose.model('account', accountmodel._schema);
    var tempor = [];
    var selectstring = '';
    json.forEach(function (js) {
        if (js.callfor == 'public' || js.callfor == 'bank') {
            tempor.push({ bank_id: js.bank_id, is_public: true });
        }
        if (js.callfor == 'publicall' || js.callfor == 'bankall') {
            tempor.push({ is_public: true });
        }
        if (js.callfor == 'private' || js.callfor == 'bank' || js.callfor == 'bankall') {
            tempor.push({ bank_id: js.bank_id, is_public: { $ne: true }, owners: { "$in": [js.customer_id] } });
        }

    });
    theaccount.find({ $or: tempor }).lean()
        .select(selectstring)
        .populate('views_available') // only works if we pushed refs to children
        .exec(function (err, found: accountsmodels.accountdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listId(string: string) {
    var deferred = Q.defer();
    var theaccount = mongoose.model('account', accountmodel._schema);
    theaccount.findOne(string).lean()
        .select('balance.currency')
        .select('_id views_available')
        .populate('views_available')
        .exec(function (err, found) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listIdView(string) {
    var deferred = Q.defer();
    var theaccount = mongoose.model('account', accountmodel._schema);
    var view = string.view;
    delete string.view;
    theaccount.findOne(string).lean()
        .select('label number owners type balance IBAN swift_bic views_available bank_id')
        .populate('views_available') // only works if we pushed refs to children
        .exec(function (err, found: accountsmodels.accountdef) {
            var params = { err: null, found: null, name: null, deferred };
            found = transform(found);
            found = checkview(found, view);
            if (found && !found.views_available[0]) {
                params.err = "No view available";
                commonservice.answer(params);
            }
            else {
                params.err = err;
                params.found = found;
                params.name = name;
                commonservice.answer(params);
            }

        });
    return deferred.promise;
}
export function listMore(string: string) {
    var deferred = Q.defer();
    var theaccount = mongoose.model('account', accountmodel._schema);
    theaccount.find(string).lean()
        .populate('views_available') // only works if we pushed refs to children
        .exec(function (err, found: accountsmodels.accountdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: accountsmodels.accountdef) {
    var deferred = Q.defer();
    var insert = accountmodel.set(object);
    if (insert.IBAN) { insert.IBAN = insert.IBAN.split(' ').join('') };
    try { insert.balance.amount = parseFloat((insert.balance.amount * 100).toFixed()); } catch (err) { };
    var theaccount = mongoose.model('account', accountmodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, theaccount, deferred);
    }
    else {
        theaccount.findOne(string)
            .exec(function (err, found: accountsmodels.accountdef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, theaccount, deferred);
                }
            });
    }
    return deferred.promise;
}
export function setid(string, object) {
    var deferred = Q.defer();
    //var insert = {$push:{ views_available: object }};
    var theaccount = mongoose.model('account', accountmodel._schema);
    theaccount.findOneAndUpdate(string, object, { new: true })
        .exec(function (err2, found) {
            if (err2) deferred.resolve({ error: err2, status: 400 });
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else {
                found = transform(found['_doc']);
                deferred.resolve({ data: found, status: 201 })
            }
        });
    return deferred.promise;
}
export function setamount(string, value: number) {
    value = parseInt((value * 100).toFixed());
    var deferred = Q.defer();
    //var insert = {$push:{ views_available: object }};
    var theaccount = mongoose.model('account', accountmodel._schema);
    theaccount.findOneAndUpdate(string, { $inc: { 'balance.amount': value } }, { new: true })
        .select('balance')
        .exec(function (err2, found) {
            if (err2) deferred.resolve({ error: err2, status: 400 });
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else {
                found = transform(found['_doc']);
                deferred.resolve({ data: found, status: 201 });
            }
        });
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var theaccount = mongoose.model('account', accountmodel._schema);
    theaccount.findOneAndRemove(string)
        .exec(function (err, found: accountsmodels.accountdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}