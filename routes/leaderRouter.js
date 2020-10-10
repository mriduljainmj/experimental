const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
var authenticate = require('../authenticate');
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.get((req,res,next) => {
    Leaders.find({})
    .then((Leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Leader);
    }, (err) => next(err))
    .catch((err) => next(err));

})
.post(authenticate.verifyUser,(req, res, next) => {
    Leaders.create(req.body)
    .then((Leader) => {
        console.log('Leader Created ', Leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Leaderss');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.remove({})
    .then((Leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Leader);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((ar) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json();
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((Leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((Leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = leaderRouter;
