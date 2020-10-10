const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promos = require('../models/promotions');
const promoRouter = express.Router();
var authenticate = require('../authenticate');
promoRouter.use(bodyParser.json());


promoRouter.route('/')

.get((req,res,next) => {
    Promos.find({})
    .then((Promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promos);
    }, (err) => next(err))
    .catch((err) => next(err));

})
.post(authenticate.verifyUser,(req, res, next) => {
    Promos.create(req.body)
    .then((Promo) => {
        console.log('Promo Created ', Promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
    })
.delete(authenticate.verifyUser,(req, res, next) => {
    Promos.remove({})
    .then((Promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promos);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promos.findById(req.params.promoId)
    .then((Promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promos/'+ req.params.promoId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((Promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Promos.findByIdAndRemove(req.params.promoId)
    .then((Promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promo);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = promoRouter;
