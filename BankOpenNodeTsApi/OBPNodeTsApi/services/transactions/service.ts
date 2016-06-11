//other api data 
import Q = require('q');
var mongoose = require('mongoose');
import transactionsmodels = require('../../models/transactions/model');
import commonservice = require('../../services/commonservice');
export var transactionmodel = new transactionsmodels.transaction();
var name = 'Transaction';
var populatefields = [
    { path: 'views_available', model: 'view' },
    { path: 'bank_id', model: 'bank', select: '_id full_name' },
    { path: 'type', model: 'product', select: 'category' },
    { path: 'owners', model: 'customer' }
];
//Transform
export function transform(schema) {
    function change(ret) {
        try {
            ret.other_account = ret.other_account_insystem;
            delete ret.other_account_insystem;
        } catch (err) { }
        try {
            ret.this_account.id = ret.this_account._id.toString();
            ret.this_account.bank = ret.this_account.bank_id;
            ret.this_account.holders = ret.this_account.owners;
            ret.this_account.kind = ret.this_account.type.category;
            delete ret.this_account.type;
            delete ret.this_account.owners;
            delete ret.this_account.bank_id;
            delete ret.this_account._id;
        } catch (err) { }
        try {
            ret.other_account.id = ret.other_account._id.toString();
            ret.other_account.bank = ret.other_account.bank_id;
            ret.other_account.holders = ret.other_account.owners;
            ret.other_account.kind = ret.other_account.type.category;
            delete ret.other_account.type;
            delete ret.other_account.owners;
            delete ret.other_account.bank_id;
            delete ret.other_account._id;
        } catch (err) { }
        try { ret.metadata.narrative = ret.metadata.narrative.text; } catch (err) { }
        try { ret.metadata.comments = ret.metadata.comments.text; } catch (err) { }
        try { ret.metadata.tags = ret.metadata.tags.text; } catch (err) { }
        try { ret.metadata.where = ret.metadata.where.text; } catch (err) { }
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
    var thetransaction = mongoose.model('transaction', transactionmodel._schema);
    var fields = 'label number owners type IBAN swift_bic views_available bank_id';
    thetransaction.find({}).lean()
        .populate({ path: 'this_account', select: fields, populate: populatefields }) // only works if we pushed refs to children
        .populate({ path: 'other_account_insystem', select: fields, populate: populatefields }) // only works if we pushed refs to children
        .populate('other_account') // only works if we pushed refs to children
        .populate('metadata.narrative', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.comments', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.tags', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.where', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: transactionsmodels.transactiondef[]) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}

export function listMore(string: string, paraments) {
    var deferred = Q.defer();
    var thetransaction = mongoose.model('transaction', transactionmodel._schema);
    var transaction = paraments.view.transaction;
    var this_fields = paraments.view.this_account;
    var other_fields = paraments.view.other_account;
    var view = paraments.view;
    thetransaction.find(string).sort({ createdAt: paraments.sort_direction }).limit(paraments.limit).lean()
        .select(transaction)
        .populate({ path: 'this_account', select: this_fields, populate: populatefields }) // only works if we pushed refs to children
        .populate({ path: 'other_account_insystem', select: other_fields, populate: populatefields }) // only works if we pushed refs to children
        .populate('other_account') // only works if we pushed refs to children
        .populate('metadata.narrative', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.comments', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.tags', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.where', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: transactionsmodels.transactiondef[]) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}


export function list(string) {
    var deferred = Q.defer();
    var thetransaction = mongoose.model('transaction', transactionmodel._schema);
    var fields = 'label number owners type IBAN swift_bic views_available bank_id';
    var view = string.view; delete string.view;
    thetransaction.findOne(string).lean()
        .populate({ path: 'this_account', select: fields, populate: populatefields }) // only works if we pushed refs to children
        .populate({ path: 'other_account_insystem', select: fields, populate: populatefields }) // only works if we pushed refs to children
        .populate('other_account') // only works if we pushed refs to children
        .populate('metadata.narrative', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.comments', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.tags', 'text -_id') // only works if we pushed refs to children
        .populate('metadata.where', 'text -_id') // only works if we pushed refs to children
        .exec(function (err, found: transactionsmodels.transactiondef) {
            found = transform(found);
            commonservice.answer(err, found, name, deferred);
        });
    return deferred.promise;
}

export function set(string: string, object: transactionsmodels.transactiondef) {
    var deferred = Q.defer();
    var insert = transactionmodel.set(object);
    var thetransaction = mongoose.model('transaction', transactionmodel._schema);
    commonservice.update(insert, thetransaction, deferred);
    return deferred.promise;
}

export function del(string: string) {
    var deferred = Q.defer();
    var thetransaction = mongoose.model('transaction', transactionmodel._schema);
    thetransaction.findOneAndRemove(string)
        .exec(function (err, found: transactionsmodels.transactiondef) {
            if (err) { deferred.resolve({ error: err, status: 500 }) }
            else if (!found) { deferred.resolve({ error: "Item not exists", status: 409 }) }
            else { deferred.resolve({ data: { "ok": 1 }, status: 200 }) }
        });
    return deferred.promise;
}