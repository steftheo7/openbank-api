//mongo data 
import Q = require('q');
import mongoose = require('mongoose');
import customersmodels = require('../../models/customers/model');
import commonservice = require('../../services/commonservice');
var customermodel = new customersmodels.customer();
var name = 'Customer';
//Transform
export function transform(schema) {
    function change(ret) {
        ret.customer_number = ret._id;
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
export function listBid(string: string) {
    var deferred = Q.defer();
    var thecustomer = mongoose.model('customer', customermodel._schema);
    thecustomer.find(string).lean()
        .exec(function (err, found: customersmodels.customerdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred };
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listId(string: string) {
    var deferred = Q.defer();
    var thecustomer = mongoose.model('customer', customermodel._schema);
    thecustomer.findOne(string).lean()
        .exec(function (err, found: customersmodels.customerdef) {
            found = transform(found);
            var params = { err, found, name, deferred };
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listMore(string: string) {
    var deferred = Q.defer();
    var thecustomer = mongoose.model('customer', customermodel._schema);
    thecustomer.find(string).lean()
        .exec(function (err, found: customersmodels.customerdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred };
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: customersmodels.customerdef) {
    var deferred = Q.defer();
    var insert = customermodel.set(object);
    var thecustomer = mongoose.model('customer', customermodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, thecustomer, deferred);
    }
    else {
        thecustomer.findOne(string)
            .exec(function (err, found: customersmodels.customerdef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, thecustomer, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var thecustomer = mongoose.model('customer', customermodel._schema);
    thecustomer.findOneAndRemove(string)
        .exec(function (err, found: customersmodels.customerdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}