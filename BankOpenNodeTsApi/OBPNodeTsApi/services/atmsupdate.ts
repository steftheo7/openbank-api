//connector 
import mongoose = require('mongoose');
import atmsservice = require('../services/atms/service');
import request = require('request');
import config = require('config');

var atmsmodel = atmsservice.atmmodel;

export function set() {
    request({
        url: config.get<string>('atmsservice.url'),
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
                var theatm = mongoose.model('atm', atmsmodel._schema);
                theatm.remove({ bank_id: "5710bba5d42604e4072d1e72" }, function (err) {
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
                        location: {
                            latitude: item.latitude,
                            longitude: item.longitude
                        },
                        name: item.code + "|" + item.nameGR,
                        acceptsDeposits: item.acceptsDeposits,
                        is24Hours: item.is24Hours,
                        islocked: true,
                        meta: { license: "5717244442f0d6001dff6c78" },
                        bank_id: "5710bba5d42604e4072d1e72"
                    };

                    var c = atmsmodel.set(newitem);
                    c.save(function (err, item: any) {
                        if (err) throw err;
                    });
                });
            }
        });
}