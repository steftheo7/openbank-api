//other api data 
import Q = require('q');
import mongoose = require('mongoose');
import otherAccountsmodels = require('../../models/otherAccounts/model');
import commonservice = require('../../services/commonservice');
var otherAccountmodel = new otherAccountsmodels.otherAccount();
var name = 'otherAccount';
//Transform
export function transform(schema) {
    function change(ret) {
        try { ret.bank = { national_identifier: ret.bank.short_name, name: ret.bank.full_name }; } catch (err) { }
        try { ret.metadata.public_alias = ret.metadata.public_alias.text; } catch (err) { }
        try { ret.metadata.private_alias = ret.metadata.private_alias.text; } catch (err) { }
        try { ret.metadata.more_info = ret.metadata.more_info.text; } catch (err) { }
        try { ret.metadata.URL = ret.metadata.URL.text; } catch (err) { }
        try { ret.metadata.image_URL = ret.metadata.image_URL.text; } catch (err) { }
        try { ret.metadata.open_corporates_URL = ret.metadata.open_corporates_URL.text; } catch (err) { }
        try { ret.metadata.corporate_location = ret.metadata.corporate_location.text; } catch (err) { }
        try { ret.metadata.physical_location = ret.metadata.physical_location.text; } catch (err) { }
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
    var theotherAccount = mongoose.model('otherAccount', otherAccountmodel._schema);
    theotherAccount.find(string).lean()
        .populate('bank', 'short_name full_name -_id') // only works if we pushed refs to children
        .populate('metadata.public_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.private_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.more_info', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.image_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.open_corporates_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.corporate_location', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.physical_location', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: otherAccountsmodels.otherAccountdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}
export function listId(string: string) {
    var deferred = Q.defer();
    var theotherAccount = mongoose.model('otherAccount', otherAccountmodel._schema);
    theotherAccount.findOne(string).lean()
        .populate('bank', 'short_name full_name -_id') // only works if we pushed refs to children
        .populate('metadata.public_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.private_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.more_info', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.image_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.open_corporates_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.corporate_location', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.physical_location', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: otherAccountsmodels.otherAccountdef) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function listMore(string: string) {
    var deferred = Q.defer();
    var theotherAccount = mongoose.model('otherAccount', otherAccountmodel._schema);
    theotherAccount.find(string).lean()
        .populate('bank', 'short_name full_name -_id') // only works if we pushed refs to children
        .populate('metadata.public_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.private_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.more_info', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.image_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.open_corporates_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.corporate_location', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.physical_location', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: otherAccountsmodels.otherAccountdef[]) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function list(string: string) {
    var deferred = Q.defer();
    var theotherAccount = mongoose.model('otherAccount', otherAccountmodel._schema);
    theotherAccount.findOne(string).lean()
        .populate('bank', 'short_name full_name -_id') // only works if we pushed refs to children
        .populate('metadata.public_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.private_alias', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.more_info', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.image_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.open_corporates_URL', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.corporate_location', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.physical_location', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: otherAccountsmodels.otherAccountdef) {
            found = transform(found);
            var params = { err, found, name, deferred }; 
            commonservice.answer(params);
        });
    return deferred.promise;
}

export function set(string: string, object: otherAccountsmodels.otherAccountdef) {
    var deferred = Q.defer();
    var insert = otherAccountmodel.set(object);    
    if (insert.IBAN){insert.IBAN = insert.IBAN.split(' ').join('')};
    var theotherAccount = mongoose.model('otherAccount', otherAccountmodel._schema);
    if (JSON.stringify(string) === "{}") {
        commonservice.update(insert, theotherAccount, deferred);
    }
    else {
        theotherAccount.findOne(string)
            .exec(function (err, found: otherAccountsmodels.otherAccountdef) {
                if (err) deferred.resolve({ error: err, status: 500 })
                else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
                else {
                    if (found && found._id) { insert._id = found._id; }
                    commonservice.update(insert, theotherAccount, deferred);
                }
            });
    }
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var theotherAccount = mongoose.model('otherAccount', otherAccountmodel._schema);
    theotherAccount.findOneAndRemove(string)
        .exec(function (err, found: otherAccountsmodels.otherAccountdef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}