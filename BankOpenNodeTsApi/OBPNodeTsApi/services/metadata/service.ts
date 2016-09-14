//mongo data 
import Q = require('q');
import mongoose = require('mongoose');
import metadatasmodels = require('../../models/metadata/model');
import commonservice = require('../../services/commonservice');
var metadatamodel = new metadatasmodels.metadata();
var name = 'Metadata';

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
    var themetadata = mongoose.model('metadata', metadatamodel._schema);
    themetadata.find({}).lean()
        .exec(function (err, found: metadatasmodels.metadatadef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function listMore(string) {
    var deferred = Q.defer();
    var themetadata = mongoose.model('metadata', metadatamodel._schema);
    themetadata.find(string).lean()
        .exec(function (err, found: metadatasmodels.metadatadef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function list(string: string) {
    var deferred = Q.defer();
    var themetadata = mongoose.model('metadata', metadatamodel._schema);
    themetadata.findOne(string).lean()
        .exec(function (err, found: metadatasmodels.metadatadef) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: metadatasmodels.metadatadef) {
    var deferred = Q.defer();
    var insert = metadatamodel.set(object);
    var themetadata = mongoose.model('metadata', metadatamodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, themetadata, deferred);
    }
    else {
        themetadata.findOne(string)
            .exec(function (err, found: metadatasmodels.metadatadef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, themetadata, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var themetadata = mongoose.model('metadata', metadatamodel._schema);
    themetadata.findOneAndRemove(string)
        .exec(function (err, found: metadatasmodels.metadatadef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}