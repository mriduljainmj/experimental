const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('dishes')
            .populate('user')
            .then((favorite) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite != null) {
                    req.body.map((dish) => {
                        if (favorite.dishes.indexOf(dish._id) === -1) {
                            favorite.dishes.push(dish._id);
                        }
                    })
                    favorite.save()
                        .then(() => {
                            Favorites.findOne({ user: req.user._id })
                                .populate('dishes')
                                .populate('user')
                                .then((favorite) => {
                                    console.log("Favorite is : " + favorite)
                                    res.StatusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite)
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
                else {
                    Favorites.create({ user: req.user._id })
                        .then((favorite) => {
                            req.body.map((dish) => {
                                favorite.dishes.push(dish._id);
                            })
                            favorite.save()
                                .then(() => {
                                    Favorites.findOne({ user: req.user._id })
                                        .populate('dishes')
                                        .populate('user')
                                        .then((favorite) => {
                                            console.log("Favorite is : " + favorite)
                                            res.StatusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite)
                                        }, (err) => next(err))
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //console.log("user profile is: " + req.user);
        Favorites.deleteOne({ user: req.user._id })
            .then((resp) => {
                console.log(resp);
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite != null) {
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                        .then(() => {
                            Favorites.findOne({ user: req.user._id })
                                .populate('dishes')
                                .populate('user')
                                .then((favorite) => {
                                    console.log("Favorite is : " + favorite)
                                    res.StatusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite)
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
                else {
                    Favorites.create({ user: req.user._id })
                        .then((favorite) => {
                            favorite.dishes.push(req.params.dishId);
                            favorite.save()
                                .then(() => {
                                    Favorites.findOne({ user: req.user._id })
                                        .populate('dishes')
                                        .populate('user')
                                        .then((favorite) => {
                                            console.log("Favorite is : " + favorite)
                                            res.StatusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite)
                                        }, (err) => next(err))
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //console.log("user profile is: " + req.user);
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite != null && favorite.dishes.indexOf(req.params.dishId) !== -1) {
                    favorite.dishes.pull({ _id: req.params.dishId });
                    favorite.save()
                        .then((favorite) => {
                            Favorites.findOne({ user: req.user._id })
                                .populate('dishes')
                                .populate('user')
                                .then((favorite) => {
                                    res.StatusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite)
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
                else {
                    err = new Error('Dish Not Found!!!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;