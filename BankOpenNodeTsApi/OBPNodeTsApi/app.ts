import express = require('express');
import http = require('http');
import https = require('https');
import path = require('path');
import mongoose = require('mongoose');
import errorhandler = require('errorhandler')
import logger = require('morgan')
import favicon = require('serve-favicon')
import config = require('config');
import bodyParser = require('body-parser')
import cookieParser = require('cookie-parser')
import passport = require('passport');
import validator = require('validator');
import transactionbot = require('./services/transactionbot');
import branchesupdate = require('./services/branchesupdate');
import atmsupdate = require('./services/atmsupdate');
var middleware = require('swagger-express-middleware');

// This line is from the Node.js HTTPS documentation.
var fs = require('fs');
var options = {
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
};

// for login with passport
import usersservice = require('./services/users/service');
import usersmodels = require('./models/users/model');
//import requestIp = require('request-ip');
//passport setup
export import passport = require('passport');
var CustomStrategy = require('passport-custom');
passport.use(new CustomStrategy(
    function (req, callback) {
        var question: any = {};
        if (req.header('Auth-Provider-Name')) { question.auth_provider_name = req.header('Auth-Provider-Name'); }
        else if (req.cookies.AuthProviderName) { question.auth_provider_name = req.cookies.AuthProviderName; }
        else { callback(null); }

        if (req.header('Auth-ID')) { question.auth_id = req.header('Auth-ID'); }
        else if (req.cookies.AuthID) { question.auth_id = req.cookies.AuthID; }
        else { callback(null); }

        if (JSON.stringify(question) === "{}") {
            callback(null);
        }
        usersservice.listMore(question).then(
            function (resp: any) {
                if (resp['error']) {
                    callback(null);
                }
                else {
                    //callback(null, JSON.parse(JSON.stringify(resp)))
                    callback(null, resp['data'])
                }
            }
        );
    }
));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

//connect database
mongoose.connect(
    config.get<string>('dbConfigs.mongodb.type') + "://" +
    config.get<string>('dbConfigs.mongodb.host') + ":" +
    config.get<string>('dbConfigs.mongodb.port') + "/" +
    config.get<string>('dbConfigs.mongodb.name')
);

// all environments
var app = express();

// warning this code overrides ssl not ok for pd
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Track-ID,Auth-Provider-Name,Auth-ID,"+
        "obp_sort_by, obp_sort_direction, obp_limit, obp_offset, obp_from_date, obp_to_date");
    //res.header("Access-Control-Allow-Methods", "*")
    //res.header("Access-Control-Allow-Headers", "*")
    next();
});

app.set('port', process.env.PORT || config.get<number>('maincfg.runningport'));
//app.set('httpsport',  config.get<number>('maincfg.httpsrunningport'));
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(cookieParser())
app.use(favicon(__dirname + '/public/images/api.ico'));
app.use(logger('dev'));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
app.set('json spaces', 2);
//filter middlware for NBG ID AND PAYLOAD
app.use(function (req: express.Request, res, next) {
    //console.log('req.method', req.method);
    if (req.method == 'OPTIONS') { req.method = req.header('access-control-request-method') };
    if (req.method == 'POST'
        || req.method == 'PUT'
        || req.method == 'DELETE'
    ) {
        if (!req.header('Track-ID'))
        { res.status(417).send('Error!no Track-ID'); next('Error!no Track-ID'); }
        else if (!validator.isUUID(req.header('Track-ID')) && !validator.isMongoId(req.header('Track-ID')))
        { res.status(417).send('Error!Track-ID must be a valid UUID'); next('Error!Track-ID must be a valid UUID'); }
    }
    console.log(req.ip);
    next();
});

//Route start
app.use('/', require('./routes/mainroutes'));
app.use('/api', require('./routes/apiroutes'));
app.use('/auth', require('./routes/auth'));
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', function (req: express.Request, res) {
    res.status(404).send('what???');
});

// development only
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

setInterval(transactionbot.set, 1000*10);
setInterval( function(){ 
    var hour = new Date().getHours();
    if (hour >= 3 && hour < 4) {
        atmsupdate.set;
        branchesupdate.set;  
    }
} , 1000*60*59);
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//https.createServer(options, app).listen(app.get('httpsport'), function () {
//    console.log('Express server http listening on port  + app.get('httpsport'));
//});

