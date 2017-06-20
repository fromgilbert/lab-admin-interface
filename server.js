/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2015 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var config = require('./config.json');

var cors = require('cors');
var bodyParse = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect(config.mongodb.host);
var mdb = mongoose.connection;

mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function(callback) {
    console.log("Connection to MongoDB successful");
});

// Import the Database Model Objects
var Data = require('intel-commerical-edge-network-database-models').Data;
var Sensor = require('intel-commerical-edge-network-database-models').Sensor;
var Actuator = require('intel-commerical-edge-network-database-models').Actuator;
var Trigger = require('intel-commerical-edge-network-database-models').Trigger;
var Error = require('intel-commerical-edge-network-database-models').Error;

var express = require('express');
var restapi = express();
restapi.use(cors());
restapi.use(bodyParse());
restapi.use(express.static(__dirname + '/app'));

// index.js
var path = require('path');
global.appRoot = path.resolve(__dirname);


// API to get list from Error table
restapi.get('/listerror', function(req, res) {
    Error.find({}, function(err, errors) {
        res.json(errors);
    });
});


// API to get list from actuator table
restapi.get('/listActuator', function(req, res) {
    Actuator.find({}, function(err, actuators) {
        res.json(actuators);
    });
});


// API to get data from Sensors table
restapi.get('/listSensor', function(req, res) {
    Sensor.find({}, function(err, sensors) {
        res.json(sensors);
    });
});


// API to get data from Triggers table
restapi.get('/listTrigger', function(req, res) {
    Trigger.find({}, function(err, triggers) {
        res.json(triggers);
    });
});


// API to get Number of Sensors which are active
restapi.get('/noOfSensor', function(req, res) {
    Sensor.count({}, function(err, n) {
        res.json(n);
    });
});

// API to get Number of Sensors which are active
restapi.get('/noOfError', function(req, res) {
    Error.count({}, function(err, n) {
        res.json(n);
    });
});


// API to get Number of Actuators which are active
restapi.get('/noOfActuator', function(req, res) {
    Actuator.count({}, function(err, n) {
        res.json(n);
    });
});


// API to get Number of Triggers which are active
restapi.get('/noOfTrigger', function(req, res) {
    Trigger.count({}, function(err, n) {
        res.json(n);
    });
});


// To remove a trigger from database
restapi.post('/removeTrigger', function(req, res) {
    Trigger.remove({
        id: req.param('id')
    }, function(err) {
        if (err) {
            res.status(500);
        } else {
            res.status(202);
        }
        res.end();
    });
});

// To add a new trigger to database
restapi.post('/addTrigger', function(req, res) {
    var trigger = new Trigger({
        id: req.param("name"),
        name: req.param("name"),
        sensor_id: req.param("sensor"),
        condition: req.param("conditions"),
        triggerFunc: req.param("triggerFunc"),
        active: req.param("active")
    });

    trigger.save(function(err, row) {
        if (err) {
            res.json(err);
            res.status(500);
        } else {
            res.status(202);
        }
        res.end();
    });
});

restapi.post('/editTrigger', function(req, res) {

    var query = {
        id: req.param('id')
    };
    var update = {
        name: req.param("name"),
        sensor_id: req.param("sensor_id"),
        condition: req.param("condition"),
        triggerFunc: req.param("triggerFunc"),
        active: req.param("active")
    }
    var options = {
        new: true
    };


    Trigger.findOneAndUpdate(query, update, options, function(err, row) {
        if (err) {
            res.json(err);
            res.status(500);
        } else {
            res.status(202);
        }
        res.end();
    });
});


restapi.get('/latestValue', function(req, res) {
    var hops = 0,
        total = 2;
    var lightValue = 100,
        tempValue = 25

    function done() {
        var value = [];
        value.push({
            "name": "Temperature",
            "value": tempValue
        })
        value.push({
            "name": "Light",
            "value": lightValue
        })
        res.json(value);
    }
    var light = Data.findOne({
        sensor_id: 'light'
    }, {}, {
        sort: {
            '$natural': -1
        }
    }, function(err, sensors) {

        if (sensors != null) {
            lightValue = sensors.value
        }
        if (++hops >= total) {
            done();
        }
    });
    var temp = Data.findOne({
        sensor_id: 'temperature'
    }, {}, {
        sort: {
            '$natural': -1
        }
    }, function(err, sensors) {

        if (sensors != null) {
            tempValue = sensors.value
        }
        if (++hops >= total) {
            done();
        }
    });
});

// Api to redirect to Angular.JS website
restapi.get('*', function(req, res) {
    res.sendFile(appRoot + '/app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

restapi.listen(5000);


console.log("Submit GET or POST Request. e.g http://localhost:5000");
