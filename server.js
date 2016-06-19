var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var soal = require('./appd/models/soal');
//var menu = require('./appd/models/menu');

var mongoURI = "mongodb://localhost/test";
var db = mongoose.connect(mongoURI);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + mongoURI);
});

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router


router.route('/soal').get(function (req, res) {
    soal.find({}).limit(30).exec(function (err, soals) {
        if (err)
            res.send(err);
        //console.log(soals);
        res.json(soals);
    });
});

router.route('/main').get(function (req, res) {
    soal.aggregate([
        {
            $project: {
                _id: 0
                , c: 1
            }
        }, {
            $unwind: '$c'
        }, {
            $group: {
                _id: "$c"
                , amount: {
                    $sum: 1
                }
            }
        }, {
            $project: {
                _id: 0
                , cat: "$_id"
                , amount: 1
            }
        }
        
        , {
            $project: {
                cat: {
                    $toUpper: "$cat"
                }
                , amount: 1
            }

        }
    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    })
});

router.route('/menu/:cat/:amnt').get(function (req, res) {
    soal.find({
            c: req.params.cat
        }).select({
            "_id": 1
        }).limit(parseInt(req.params.amnt))
        .exec(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        })
});
router.route('/soal/:oid').get(function (req, res) {
    soal.find({
            _id: req.params.oid
        })
        .exec(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        })
});

router.route('/smallicons/:cat').get(function (req, res) {
    soal.aggregate([
        {
            $match: {
                c: req.params.cat
            }
        }
        
        , {
            $project: {
                _id: 0
                , c: 1
            }
        }, {
            $unwind: '$c'
        }, {
            $group: {
                _id: "$c"
            }
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    })
});

router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}