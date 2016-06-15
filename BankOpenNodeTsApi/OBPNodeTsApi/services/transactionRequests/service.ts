//other api data 
import Q = require('q');
import mongoose = require('mongoose');
import transactionRequestsmodels = require('../../models/transactionRequests/model');
import commonservice = require('../../services/commonservice');
var transactionRequestmodel = new transactionRequestsmodels.transactionRequest();
var name = 'transactionRequest';
//Transform
export function transform(schema) {
    function change(ret) {
        ret.from = { account_id: ret.account_id.toString(), bank_id: ret.bank_id.toString() };
        delete ret.account_id;
        delete ret.bank_id;
        ret.body = { to: ret.to, value: ret.value };
        delete ret.to;
        delete ret.value;
        ret.id = ret._id;
        ret.start_date = ret.createdAt;
        delete ret.supported_challenge_types;
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
    var thetransactionRequest = mongoose.model('transactionRequest', transactionRequestmodel._schema);
    thetransactionRequest.find({}).lean()
        //.populate('this_account', 'text -_id') // only works if we pushed refs to children
        //.populate('other_account', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: transactionRequestsmodels.transactionRequestdef[]) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}

export function listMore(string: string) {
    var deferred = Q.defer();
    var thetransactionRequest = mongoose.model('transactionRequest', transactionRequestmodel._schema);
    thetransactionRequest.find(string).lean()
        //.populate('this_account', 'text -_id') // only works if we pushed refs to children
        //.populate('other_account', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: transactionRequestsmodels.transactionRequestdef[]) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}


export function list(string: string) {
    var deferred = Q.defer();
    var thetransactionRequest = mongoose.model('transactionRequest', transactionRequestmodel._schema);
    thetransactionRequest.findOne(string).lean()
        //.populate('this_account', 'text -_id') // only works if we pushed refs to children
        //.populate('other_account', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: transactionRequestsmodels.transactionRequestdef) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}

export function set(string: string, object: transactionRequestsmodels.transactionRequestdef) {
    var deferred = Q.defer();
    var insert = transactionRequestmodel.set(object);
    var thetransactionRequest = mongoose.model('transactionRequest', transactionRequestmodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, thetransactionRequest, deferred);
    }
    else {
        thetransactionRequest.findOne(string)
            .exec(function (err, found: transactionRequestsmodels.transactionRequestdef) {
                if (err) deferred.resolve({ error: err, status: 500 });
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, thetransactionRequest, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var thetransactionRequest = mongoose.model('transactionRequest', transactionRequestmodel._schema);
    thetransactionRequest.findOneAndRemove(string)
        .exec(function (err, found: transactionRequestsmodels.transactionRequestdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}