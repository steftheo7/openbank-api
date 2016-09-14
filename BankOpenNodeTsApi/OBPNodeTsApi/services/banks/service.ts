//mongo data 
import Q = require('q');
import mongoose = require('mongoose');
import banksmodels = require('../../models/banks/model');
import commonservice = require('../../services/commonservice');
var bankmodel = new banksmodels.bank();
var name = 'Bank';
//Transform
export function transform(schema) {
    function change(ret) {
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
export function listAll() {
    var deferred = Q.defer();
    var thebank = mongoose.model('bank', bankmodel._schema);
    thebank.find({}).lean()
        .exec(function (err, found: banksmodels.bankdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred };
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function listId(string: string) {
    var deferred = Q.defer();
    var thebank = mongoose.model('bank', bankmodel._schema);
    thebank.findOne(string).lean()
        .exec(function (err, found: banksmodels.bankdef) {
            found = transform(found);
            var params = { err, found, name, deferred };
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function listMore(string: string) {
    var deferred = Q.defer();
    var thebank = mongoose.model('bank', bankmodel._schema);
    thebank.find(string).lean()
        .exec(function (err, found: banksmodels.bankdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred };
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: banksmodels.bankdef) {
    var deferred = Q.defer();
    var insert = bankmodel.set(object);
    var thebank = mongoose.model('bank', bankmodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, thebank, deferred);
    }
    else {
        thebank.findOne(string)
            .exec(function (err, found: banksmodels.bankdef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, thebank, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var thebank = mongoose.model('bank', bankmodel._schema);
    thebank.findOneAndRemove(string)
        .exec(function (err, found: banksmodels.bankdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}