//mongo data 
import Q = require('q');
import mongoose = require('mongoose');
import productsmodels = require('../../models/products/model');
import commonservice = require('../../services/commonservice');
var productmodel = new productsmodels.product();
var name = 'Product';
//Transform
export function transform(schema) {
    function change(ret) {
        //     try { ret.bank_id = ret.bank_id.text; } catch (err) { }
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

export function listBid(string: string) {
    var deferred = Q.defer();
    var theproduct = mongoose.model('product', productmodel._schema);
    theproduct.find(string).lean()
        .exec(function (err, found: productsmodels.productdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listId(string: string) {
    var deferred = Q.defer();
    var theproduct = mongoose.model('product', productmodel._schema);
    theproduct.find(string).lean()
        .exec(function (err, found: productsmodels.productdef) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listMore(string: string) {
    var deferred = Q.defer();
    var theproduct = mongoose.model('product', productmodel._schema);
    theproduct.find(string).lean()
        //   .populate('bank_id', 'text') // only works if we pushed refs to children
        .exec(function (err, found: productsmodels.productdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function set(string: string, object: productsmodels.productdef) {
    var deferred = Q.defer();
    var insert = productmodel.set(object);
    var theproduct = mongoose.model('product', productmodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, theproduct, deferred);
    }
    else {
        theproduct.findOne(string)
            .exec(function (err, found: productsmodels.productdef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, theproduct, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var theproduct = mongoose.model('product', productmodel._schema);
    theproduct.findOneAndRemove(string)
        .exec(function (err, found: productsmodels.productdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });

    return deferred.promise;
}