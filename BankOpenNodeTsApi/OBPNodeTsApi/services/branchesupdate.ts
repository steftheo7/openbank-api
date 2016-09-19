//connector 
import mongoose = require('mongoose');
import branchesservice = require('../services/branches/service');
import request = require('request');
import config = require('config');

var branchemodel = branchesservice.branchemodel;

export function set() {
    request({
        url: config.get<string>('branchesservice.url'),
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        //Lets post the following key/values as form
        body: "{'payload':{}}"
    },
        function (error, response, body) {
            if (error) {
                throw error;
            } else {
                body = JSON.parse(body).payload;
                var thebranche = mongoose.model('branche', branchemodel._schema);
                thebranche.remove({ bank_id: "5710bba5d42604e4072d1e72" }, function (err) {
                    if (err) throw err;
                });
                body.forEach(function (item) {
                    var newitem: any = {
                        address: {
                            line_1: item.addressGR,
                            line_2: item.addressEN,
                            line_3: null,
                            city: item.areaNameGR,
                            state: null,
                            postcode: null,
                            country: null
                        },
                        lobby: { is24Hours: item.is24Hours },
                        name: item.code + "|" + item.nameGR,
                        location: {
                            latitude: item.latitude,
                            longitude: item.longitude
                        },
                        acceptsDeposits: item.acceptsDeposits,
                        islocked: true,
                        meta: { license: "5717244442f0d6001dff6c78" },
                        bank_id: "5710bba5d42604e4072d1e72"
                    };

                    var c = branchemodel.set(newitem);
                    c.save(function (err, item: any) {
                        if (err) throw err;
                    });
                });
            }
        });
}