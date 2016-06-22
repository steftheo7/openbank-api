import viewsservice = require('../services/views/service');
import Q = require('q');

export function customcontainsregexp(string: string) {
    return new RegExp(string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i");
}
export function bankpermissions(req) {
    return req.user.bank_permissions.filter(function (x) { return x.bank_id == req.params.bid; })[0];
}
export function bankscustomers(req) {
    return req.user.bank_permissions.filter(function (x) { return x.customer_id; });
}

export function viewfields(view, type: string) {
    //type must be only transaction/account/otheraccount
    var params: any = {};
    var bank_id = { full_name: 'bank_id.full_name', short_name: 'bank_id.short_name' };
    if ((type == 'transaction') || (type == 'account')) {
        var balance = { currency: 'balance.currency', amount: 'balance.amount' };
        params.this_account = {
            _id: 1, 'bank_id.full_name': 0, 'bank_id.short_name': 0,
            'balance.currency': 0, 'balance.amount': 0
        };
        if (view.can_see_bank_account_owners) { params.this_account.owners = 1 };
        if (view.can_see_bank_account_number) { params.this_account.number = 1 };
        if (view.can_see_bank_account_type) { params.this_account.type = 1 };
        if (view.can_see_bank_account_iban) { params.this_account.IBAN = 1 };
        if (view.can_see_bank_account_swift_bic) { params.this_account.swift_bic = 1 };
        if (type == 'account') {
            if (view.can_see_bank_account_balance) { params.this_account[balance.amount] = 1 }
            if (view.can_see_bank_account_currency) { params.this_account[balance.currency] = 1 }
            if (view.can_see_bank_account_label) { params.this_account.label = 1 };
            for (var items in params.this_account)
            { if (params.this_account[items] == 0) { delete params.this_account[items] } };
            params = params.this_account;
        } else {
            for (var items in params.this_account)
            { if (params.this_account[items] == 0) { delete params.this_account[items] } }
        };
    };
    if ((type == 'transaction') || (type == 'otheraccount')) {
        params.other_account = {
            _id: 1, 'bank_id.full_name': 0, 'bank_id._id': 0, 'metadata.more_info': 0, 'metadata.url': 0,
            'metadata.image_url': 0, 'metadata.open_corporates_url': 0, 'metadata.corporate_location': 0,
            'metadata.physical_location': 0, 'metadata.public_alias': 0, 'metadata.private_alias': 0
        };
        var metadata = {
            more_info: 'metadata.more_info', url: 'metadata.url', image_url: 'metadata.image_url',
            open_corporates_url: 'metadata.open_corporates_url', corporate_location: 'metadata.corporate_location',
            physical_location: 'metadata.physical_location', public_alias: 'metadata.public_alias',
            private_alias: 'metadata.private_alias'
        };
        if (view.can_see_other_account_number) { params.other_account.number = 1 };
        if (view.can_see_other_account_kind) { params.other_account.type = 1 };
        if (view.can_see_other_account_iban) { params.other_account.IBAN = 1 };
        if (view.can_see_other_account_swift_bic) { params.other_account.swift_bic = 1 };
        if (view.can_see_other_account_bank_name) { params.this_account[bank_id.full_name] = 1 };
        if (view.can_see_other_account_national_identifier) { params.other_account[bank_id.short_name] = 1 };
        if (view.can_see_other_account_metadata) { params.other_account.metadata = 1 };
        if (view.can_see_more_info) { params.other_account[metadata.more_info] = 1 };
        if (view.can_see_url) { params.other_account[metadata.url] = 1 };
        if (view.can_see_image_url) { params.other_account[metadata.image_url] = 1 };
        if (view.can_see_open_corporates_url) { params.other_account[metadata.open_corporates_url] = 1 };
        if (view.can_see_corporate_location) { params.other_account[metadata.corporate_location] = 1 };
        if (view.can_see_physical_location) { params.other_account[metadata.physical_location] = 1 };
        if (view.can_see_public_alias) { params.other_account[metadata.public_alias] = 1 };
        if (view.can_see_private_alias) { params.other_account[metadata.private_alias] = 1 };
        for (var items in params.other_account)
        { if (params.other_account[items] == 0) { delete params.other_account[items] } };
        if (type == 'otheraccount') { params = params.other_account; };
    };
    if (type == 'transaction') {
        params.transaction = {
            _id: 1, uuid: 1, 'details.status': 1, 'details.description': 1, 'details.posted_by_user_id': 1,
            'details.approved_by_user_id': 1, 'details.paused_by_user_id': 1, 'details.cancelled_by_user_id': 1,
            'details.posted_by_ip_address': 1, 'details.approved_by_ip_address': 1,
            'details.paused_by_ip_address': 1, 'details.cancelled_by_ip_address': 1, 'details.value': 1,
            'details.new_balance.currency': 0, 'details.new_balance.amount': 0, 'details.type': 0,
            'details.posted': 0, 'details.completed': 0, 'metadata.comments': 0, 'metadata.narrative': 0,
            'metadata.tags': 0, 'metadata.images': 0, 'metadata.where': 0
        };
        var details = {
            currency: 'details.new_balance.currency', amount: 'details.new_balance.amount', type: 'details.type',
            posted: 'details.posted', completed: 'details.completed'
        };
        var meta = {
            comments: 'metadata.comments', narrative: 'metadata.narrative', tags: 'metadata.tags',
            images: 'metadata.images', where: 'metadata.where'
        }
        if (view.can_see_transaction_this_bank_account) { params.transaction.this_account = 1 };
        if (view.can_see_transaction_other_bank_account) { params.transaction.other_account = 1; params.transaction.other_account_insystem = 1 };
        if (view.can_see_transaction_metadata) { params.transaction.metadata = 1 };
        if (view.can_see_transaction_label) { };
        if (view.can_see_transaction_balance && view.can_see_transaction_currency) { params.transaction[details.currency] = 1 }
        if (view.can_see_transaction_balance && view.can_see_transaction_amount) { params.transaction[details.amount] = 1 }
        if (view.can_see_transaction_type) { params.transaction[details.type] = 1 }
        if (view.can_see_transaction_start_date) { params.transaction[details.posted] = 1 }
        if (view.can_see_transaction_finish_date) { params.transaction[details.completed] = 1 }
        if (view.can_see_bank_account_bank_name) { params.this_account[bank_id.full_name] = 1 }
        if (view.can_see_bank_account_national_identifier) { params.this_account[bank_id.short_name] = 1 }
        if (view.can_see_comments) { params.transaction[meta.comments] = 1 }
        if (view.can_see_narrative) { params.transaction[meta.narrative] = 1 }
        if (view.can_see_tags) { params.transaction[meta.tags] = 1 }
        if (view.can_see_images) { params.transaction[meta.images] = 1 }
        if (view.can_see_where_tag) { params.transaction[meta.where] = 1 }
        for (var items in params.transaction)
        { if (params.transaction[items] == 0) { delete params.transaction[items] } };
    };
    return params;
}

//This function is for message error handling before calling the DB
export function check(checker) {
    var req = checker.params[0];
    var res = checker.params[1];
    var next = checker.params[2];
    //flag to check if there is an error on not
    var flag: Boolean;
    var bankchecked: Boolean;
    var viewchecked: Boolean;
    var tmpname: string;
    function msg(str: string) {
        //var test = str.search('can_edit');
        if (str.search('can_') != -1) {
            //msgdata.can_do.message = "User has no " + str;
            tmpname = str;
            str = 'can_do';
        }
        return str;
    }
    function TransactionAccount(localflag: Boolean) {
        localflag = false;
        var msg: string;
        function dubaccount(fromAcc) {
            if (fromAcc) {
                try {
                    if ((fromAcc == req.body.to.account_id) || (fromAcc == req.body.to.other_account_id)) {
                        msg = "From and To Account are the same";
                        return true;
                    }
                } catch (err) { }
            }
            return false;
        }
        function checkbank(bank, path) {
            if (!bank) {
                msg = "Bank_ID missing in Path " + path;
                return true;
            }
            return false;
        }
        function accountfields(account_id, other_account_id, bank, path) {
            if (account_id && other_account_id) {
                msg = "Account_id And Other_account_id cannot be together in Path " + path;
                return true;
            }
            else if (!account_id && !other_account_id) {
                msg = "account_id or other_account_id Missing in Path " + path;
                return true;
            }
            else if (checkbank(bank, path)) {
                return true;
            }
            else return false;
        }
        if (req.params.acid) {
            if (checkbank(req.params.bid, 'url') || dubaccount(req.params.acid))
                localflag = true;
        }
        else if (req.body.from) {
            var account_id = req.body.from.account_id;
            var other_account_id = req.body.from.other_account_id;
            if (accountfields(account_id, other_account_id, req.body.from.bank_id, 'from')) {
                localflag = true;
            }
            else if (dubaccount(account_id) || dubaccount(other_account_id)) {
                localflag = true;
            }
        }
        else {
            msg = "from Missing";
            localflag = true;
        }
        if (req.body.to) {
            if (accountfields(req.body.to.account_id, req.body.to.other_account_id, req.body.to.bank_id, 'to'))
            { localflag = true; }
        }
        else {
            msg = "to Missing";
            localflag = true;
        }
        msgdata.TransactionAccount.message = msg;
        return localflag;
    }
    function permission(callername: string) {
        var msg: string = "User has no " + tmpname;
        var x: Boolean = true;
        var tempcheck: Boolean;
        if (req.user) {
            if (req.user[message]) { x = false; }
            else {
                if (!bankchecked) {
                    if (msgdata.bank_id.flag(tempcheck)) {
                        msgdata[callername].message = msgdata.bank_id.message;
                        msgdata[callername].stat = msgdata.bank_id.stat;
                        return x = true;
                    }
                }
                {
                    try { if (bankpermissions(req)[message]) { x = false } else { msg += " in Bank Permissions" } }
                    catch (err) { if (x && (req.user[message] != false)) msg += " in Bank Permissions" }
                };
            }
        };
        if (x) {
            if (!viewchecked) {
                if (msgdata.view_id.flag(tempcheck)) {
                    msgdata[name].message = msgdata.view_id.message;
                    msgdata[name].stat = msgdata.view_id.stat;
                    return x = true;
                }
            };
            { try { if (req.params.view[message]) { x = false } else { msg = "User has no " + tmpname + " in Views" } } catch (err) { }; }
        }
        msgdata.can_do.message = msg;
        return x;
    }
    function providers(localflag: Boolean) {
        localflag = false;
        var msg: string;
        if (req.body.providers.length === undefined || req.body.providers.length == 0) {
            msg = "No Provider Added";
            localflag = true;
        }
        else {
            req.body.providers.forEach(function (prov, index) {
                if (JSON.stringify(prov) === "{}") {
                    msg = "One of the Providers is Empty";
                    localflag = true;
                }
                else {
                    for (var i = index + 1; i < req.body.providers.length; i++) {
                        if (prov.auth_provider_name == req.body.providers[i].auth_provider_name) {
                            msg = "Duplicate Provider found";
                            localflag = true;
                        }
                    }
                }
            });
        }
        msgdata.providers.message = msg;
        return localflag;
    }
    var msgdata = {
        //fieldname: { stat: 404, message: "not Found", flag: function (x: Boolean) { x = true; return x; } }, //example
        data: { stat: 412, message: "No input data or wrong input data", flag: function (x: Boolean) { if (JSON.stringify(req.body) === "{}") { x = true } return x; } },
        bank_id: { stat: 412, message: "User has no relation with this bank", flag: function (x: Boolean) { bankchecked = true; if (req.params.bid && !bankpermissions(req)) { x = true }; return x; } },
        view_id: { stat: 404, message: "No View Available", flag: function (x: Boolean) { viewchecked = true; if (!req.params.view && req.params.vid) { x = true }; return x; } },
        customer_id: { stat: 404, message: "User is not a customer for this bank", flag: function (x: Boolean) { return permission('customer_id'); } },
        can_do: { stat: 403, message: "Can Do Error", flag: function (x: Boolean) { return permission('can_do'); } },
        providers: { stat: 501, message: "Providers Error", flag: function (x: Boolean) { return providers(x); } },
        TransactionAccount: { stat: 400, message: "Transaction Account Error", flag: function (x: Boolean) { return TransactionAccount(x); } }
    };

    for (var message of checker.field) {
        var tempmsg: string = msg(message);
        if (msgdata[tempmsg]) {
            var jsres: any = msgdata[tempmsg];
            flag = jsres.flag(flag);
        }
        else {
            console.log('Field ' + message + ' Not Exist');
            flag = false;
        }
        if (flag) {
            res.status(jsres.stat).send({ reqwas: req.body, error: jsres.message }); next(jsres.message)
            return false;
        }
    }
    return true;
}
export function response(resp, name, res, next) {
    if (resp['error']) {
        res.status(resp.status).send('Error: ' + resp.error); next(resp.error)
    }
    else if (resp['data']) {
        if (resp.data.constructor === Array) {
            for (var item in name) { name[item] = resp.data; resp.data = name; }
        }
        res.status(resp.status).send(resp.data);
    }
    else {
        // res.status(500).send(resp); //Uncomment to see the response
        res.status(500).send('Server Error');
    }
    return;
}