const SubscriptionsModel = require('../../models/subscriptions-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
module.exports = {

    create: function (req, res, next) {
        if (!req.body.name && !req.body.price &&!req.body.details) {
            res.status(200);
            res.json({
                success: false,
                errors: { name: { message: "name is required" } }
            });
        }
        else {
            var newSubscripton = new SubscriptionsModel({
                name: req.body.name,
                price: req.body.price,
                details: req.body.details,
            });
            newSubscripton.save(function (err) {
                if (err) {
                    console.log("Error in saving", err);
                    res.status(200);
                    return res.json({
                        success: false,
                        errors: errors,
                        message: err.errmsg
                    });
                }
                res.json({
                    success: true,
                    data: {
                        subscriptions: newSubscripton,
                        message: "saved successfully!"
                    }
                });
            });
        }
    },
    index: function (req, res, next) {
        let searchField = req.query.search;
        if (searchField === undefined) {
            SubscriptionsModel.find({}, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "fetched successfully",
                        data: {
                            subscriptions: data
                        }
                    });
                }
            });
        }
        else {
            SubscriptionsModel.find({ name: { $regex: searchField, $options: 'i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: " searched successfully",
                        data: {
                            subscriptions: data
                        }
                    });
                }

            })
        }
    },
    delete: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        SubscriptionsModel.findOne({ _id: ObjectId(id) }, {}, (err, data) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (data) {
                data.remove();
                res.send({
                    message: "success.",
                    data: {
                        subscriptions: data
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    },
    upsert: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;
        if (id == 'new') {
            id = new ObjectId();
        } else {
            id = ObjectId(id);
        }
        SubscriptionsModel.updateOne({ _id: id }, params, { upsert: true }, (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({
                    message: "success.",
                    data: {
                        subscriptions: data
                    }
                });
            }
        });
    },
    show: function (req, res, next) {
        let id = req.params.id;
        SubscriptionsModel.findOne({ _id: ObjectId(id) }, {}, (err, data) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (data) {
                res.send({
                    message: "success.",
                    data: {
                        subscriptions: data
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
}