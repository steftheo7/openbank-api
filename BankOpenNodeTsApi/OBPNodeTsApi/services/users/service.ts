//mongo data 
import Q = require('q');
import mongoose = require('mongoose');
import usersmodels = require('../../models/users/model');
import commonservice = require('../../services/commonservice');
var usermodel = new usersmodels.user();
var name = 'User';
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
    var theuser = mongoose.model('user', usermodel._schema);
    theuser.find({}).lean()
        .exec(function (err, found: usersmodels.userdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function listId(string: string) {
    var deferred = Q.defer();
    var theuser = mongoose.model('user', usermodel._schema);
    theuser.findOne(string).lean()
        .exec(function (err, found: usersmodels.userdef) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function listMore(string: string) {
    var deferred = Q.defer();
    var theuser = mongoose.model('user', usermodel._schema);
    theuser.findOne({ providers: { $elemMatch: string } }).lean()
        .exec(function (err, found: usersmodels.userdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function listExist(json: any) {
    var deferred = Q.defer();
    var theuser = mongoose.model('user', usermodel._schema);
    var tempor = [];
    json.forEach(function (js) {
        tempor.push({
            providers: {
                $elemMatch: {
                    auth_provider_name: js.auth_provider_name, auth_id: js.auth_id
                }
            }
        })
    });
    theuser.find({ $or: tempor }).lean()
        .select('providers -_id')
        .exec(function (err, found: usersmodels.userdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: usersmodels.userdef) {
    var deferred = Q.defer();
    var insert = usermodel.set(object);
    var theuser = mongoose.model('user', usermodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, theuser, deferred);
    }
    else {
        theuser.findOne(string)
            .exec(function (err, found: usersmodels.userdef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, theuser, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var theuser = mongoose.model('user', usermodel._schema);
    theuser.findOneAndRemove(string)
        .exec(function (err, found: usersmodels.userdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}