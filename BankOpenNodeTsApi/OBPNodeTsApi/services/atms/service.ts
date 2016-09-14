//other api data 
import Q = require('q');
import request = require('request');
import config = require('config');
import mongoose = require('mongoose');
import atmsmodels = require('../../models/atms/model');
import commonservice = require('../../services/commonservice');
var atmmodel = new atmsmodels.atm();
var name = 'Atm';
//Transform
export function transform(schema) {
    function change(ret) {
        try { ret.meta.license = ret.meta.license.text; } catch (err) { }
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
//connect to legacy public services example
export function listAll2(a: any) {
    var deferred = Q.defer();
    request({
        url: config.get<string>('atmsservice.url'),
        method: 'POST',
        //Lets post the following key/values as form
        json: a
    },
        function (error, response, body) {
            if (error) {
                deferred.resolve(error);
            } else {
                for (var a in body) {
                    body[a].atmCode = config.get<any>('atmsservice.atmcode')
                }
                deferred.resolve(body);
            }
        });
    return deferred.promise;
}

export function listBid(string: string) {
    var deferred = Q.defer();
    var theatm = mongoose.model('atm', atmmodel._schema);
    theatm.find(string).lean()
        .populate('meta.license', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: atmsmodels.atmdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listId(string: string) {
    var deferred = Q.defer();
    var theatm = mongoose.model('atm', atmmodel._schema);
    theatm.findOne(string).lean()
        .populate('meta.license', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: atmsmodels.atmdef) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listMore(string: string) {
    var deferred = Q.defer();
    var theatm = mongoose.model('atm', atmmodel._schema);
    theatm.find(string).lean()
        .populate('meta.license', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: atmsmodels.atmdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: atmsmodels.atmdef) {
    var deferred = Q.defer();
    var insert = atmmodel.set(object);
    var theatm = mongoose.model('atm', atmmodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, theatm, deferred);
    }
    else {
        theatm.findOne(string)
            .exec(function (err, found: atmsmodels.atmdef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 404 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, theatm, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var theatm = mongoose.model('atm', atmmodel._schema);
    theatm.findOneAndRemove(string)
        .exec(function (err, found: atmsmodels.atmdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 404 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}