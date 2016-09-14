//mongo data 
import Q = require('q');
import mongoose = require('mongoose');
import messagesmodels = require('../../models/messages/model');
import commonservice = require('../../services/commonservice');
var messagemodel = new messagesmodels.message();
var name = 'Message';
//Transform
export function transform(schema) {
    function change(ret) {
        ret.id = ret._id;
        ret.date = ret.createdAt;
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
    var themessage = mongoose.model('message', messagemodel._schema);
    themessage.find(string).lean()
        .exec(function (err, found: messagesmodels.messagedef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listId(string: string) {
    var deferred = Q.defer();
    var themessage = mongoose.model('message', messagemodel._schema);
    themessage.findOne(string).lean()
        //.populate('type', 'name -_id') // only works if we pushed refs to children
        .exec(function (err, found: messagesmodels.messagedef) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listMore(string: string) {
    var deferred = Q.defer();
    //Transform
    var themessage = mongoose.model('message', messagemodel._schema);
    themessage.find(string).lean()
        //  .populate('bank_id', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: messagesmodels.messagedef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: messagesmodels.messagedef) {
    var deferred = Q.defer();
    var insert = messagemodel.set(object);
    var themessage = mongoose.model('message', messagemodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, themessage, deferred);
    }
    else {
        themessage.findOne(string)
            .exec(function (err, found: messagesmodels.messagedef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, themessage, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var themessage = mongoose.model('message', messagemodel._schema);
    themessage.findOneAndRemove(string)
        .exec(function (err, found: messagesmodels.messagedef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}