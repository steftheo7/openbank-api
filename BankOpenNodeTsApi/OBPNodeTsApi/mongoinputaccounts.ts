//connector 
import mongoose = require('mongoose');
import fs = require('fs');
import config = require('config');
import IBAN = require('iban');
//connect database
mongoose.connect(
    config.get<string>('dbConfigs.mongodb.type') + "://" +
    config.get<string>('dbConfigs.mongodb.host') + ":" +
    config.get<string>('dbConfigs.mongodb.port') + "/" +
    config.get<string>('dbConfigs.mongodb.name')
);

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('.././data/accounts.csv')
});


//Input accounts
import accounts = require('./models/accounts/model');

//var obj = JSON.parse(file.replace(/^\uFEFF/, ''));
var b = new accounts.account();
var i = 0;
lineReader.on('line', function (line) {
    var items = line.split(",");
    var num = "57572c7ff28b1" + (parseInt("0xa642b960120", 16) + parseInt("0x" + i.toString(), 16)).toString(16);
    if (items[0] != null) {
        i++;
        var arr = [items[1]];
        var a: any = {
            _id: mongoose.mongo.ObjectId(num),
            label: "acc_" + items[0] + "_acc",
            number: items[0],
            owners: items[5],
            type: items[1],
            balance:
            {
                currency: 'EUR',
                amount: parseFloat((items[3] * 100).toFixed()),
            },
            IBAN: IBAN.fromBBAN("GR", "1234567890123" + items[0].toString()),
            is_public: items[4],
            views_available: ["573d973a31455adc1de2aa54"],
            bank_id: "5710bba5d42604e4072d1e72"
        };

        console.log("item:" + JSON.stringify(a) + "\n");

        var c = b.set(a);

        c.save(function (err, item: any) {
            if (err) throw err;

            if (item != null) {
                console.log('account saved successfully!');
            }
        });

    }
})