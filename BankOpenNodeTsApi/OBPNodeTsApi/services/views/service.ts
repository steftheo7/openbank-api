//other api data 
import Q = require('q');
import mongoose = require('mongoose');
import viewsmodels = require('../../models/views/model');
import commonservice = require('../../services/commonservice');
var viewmodel = new viewsmodels.view();
var name = 'View';
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
export function reqView(request) {
    var deferred = Q.defer();
    var theview = mongoose.model('view', viewmodel._schema);
    var tempor = [];
    if (request.user_id) tempor.push({ _id: request._id, user_id: request.user_id, bank_id: request.bank_id });
    tempor.push({ _id: request._id, is_public: true, bank_id: request.bank_id });
    theview.findOne({ $or: tempor }).lean()
        .exec(function (err, found: viewsmodels.viewdef) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}
export function listBid(string: string) {
    var deferred = Q.defer();
    var theview = mongoose.model('view', viewmodel._schema);
    theview.find(string).lean()
        .exec(function (err, found: viewsmodels.viewdef[]) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}

export function listId(string: string) {
    var deferred = Q.defer();
    var theview = mongoose.model('view', viewmodel._schema);
    theview.findOne(string).lean()
        .exec(function (err, found: viewsmodels.viewdef) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}

export function listMore(string: string) {
    var deferred = Q.defer();
    var theview = mongoose.model('view', viewmodel._schema);
    theview.find(string).lean()
        .exec(function (err, found: viewsmodels.viewdef[]) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}

export function set(string: string, object: viewsmodels.viewdef) {
    var deferred = Q.defer();
    try {
        for (var items of object['allowed_actions']) {
            object[items] = true;
        }
        delete object['allowed_actions'];
    }
    catch (err) { }
    var insert = viewmodel.set(object);
    var theview = mongoose.model('view', viewmodel._schema);

    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, theview, deferred);
    }
    else {
        theview.findOne(string)
            .exec(function (err, found: viewsmodels.viewdef) {
                if (err) deferred.resolve({ error: err, status: 500 });
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, theview, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var theview = mongoose.model('view', viewmodel._schema);
    theview.findOneAndRemove(string)
        .exec(function (err, found: viewsmodels.viewdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }

        });

    return deferred.promise;
}