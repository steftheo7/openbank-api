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
            try {
                if ((fromAcc == req.body.to.account_id) || (fromAcc == req.body.to.other_account_id)) {
                    msg = "From and To Account are the same";
                    return true;
                }
            } catch (err) { }
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
    function permission(name: string) {
        var msg: string = "User has no " + tmpname;
        var x: Boolean = true;
        var tempcheck: Boolean;
        if (req.user) {
            if (req.user[message]) { x = false; }
            else {
                if (!bankchecked) {
                    if (msgdata.bank_id.flag(tempcheck)) {
                        msgdata[name].message = msgdata.bank_id.message;
                        msgdata[name].stat = msgdata.bank_id.stat;
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
        view_id: { stat: 404, message: "No View Available", flag: function (x: Boolean) { viewchecked = true; if (!req.params.view) { x = true }; return x; } },
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