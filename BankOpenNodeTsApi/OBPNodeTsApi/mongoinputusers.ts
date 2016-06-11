//connector 
import mongoose = require('mongoose');
import fs = require('fs');
import config = require('config');
//connect database
mongoose.connect(
    config.get<string>('dbConfigs.mongodb.type') + "://" +
    config.get<string>('dbConfigs.mongodb.host') + ":" +
    config.get<string>('dbConfigs.mongodb.port') + "/" +
    config.get<string>('dbConfigs.mongodb.name')
);

//var lineReader = require('readline').createInterface({
//  input: require('fs').createReadStream('.././data/products.csv')
//});

//lineReader.on('line', function (line) {
//  console.log('Line from file:', line);
//});
//Input products
import users = require('./models/users/model');

//var obj = JSON.parse(file.replace(/^\uFEFF/, ''));
var b = new users.user();
//lineReader.on('line', function (line) {
//   var items = line.split(",");
//  if (items[0] != null) {
//  console.log("obj[1] : " + item.code);
var id = null;
//       if (items[4] && items[4].length > 4 ){
//         var id  =  mongoose.mongo.ObjectId(items[4]);
//           }
var a: any = {

    short_name: "fanis",
    display_name: "fanis user ",
    can_add_bank: true,
    can_add_users: true,
    providers: [
        {
            auth_provider_name: "fakelogin",
            auth_id: "123456789"
        }
    ],
    bank_permissions: [
        {
            bank_id: "5710bba5d42604e4072d1e72",
            customer_id: "5731e8bf7315923c15ac9762",
            can_edit_products: true,
            can_edit_customers: true,
            can_edit_branches: true,
            can_edit_atms: true,
            can_add_all_transactions_for_banks: true,
            can_edit_all_transactions_for_banks: true

        }
    ]
};

var c = b.set(a);
c.save(function (err, item: any) {
    if (err) throw err;
    console.log('user saved successfully!');
    if (item != null) {
    }
});