const SpeedLevelModel = require('../../models/speedLevel-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
module.exports = {

    create: function (req, res, next) {
        if (!req.body.name ||!req.body.points ||!req.body.condition) {
            res.status(200);
            res.json({
                success: false,
                errors: { name: { message: "name is required" } }
            });
        }
        else {
            var newSpeed = new SpeedLevelModel({
                name: req.body.name,
                points: req.body.points,
                condition: req.body.condition,
            });
            newSpeed.save(function (err) {
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
                        speedLevel: newSpeed,
                        message: "saved successfully!"
                    }
                });
            });
        }
    },
    index: function (req, res, next) {
        let searchField = req.query.search;
        if (searchField === undefined) {
            SpeedLevelModel.find({}, (err, speed) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "fetched successfully",
                        data: {
                            speedLevel: speed
                        }
                    });
                }
            });
        }
        else {
            SpeedLevelModel.find({ name: { $regex: searchField, $options: '$i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: " searched successfully",
                        data: {
                            speedLevel: data
                        }
                    });
                }

            })
        }
    },
    delete: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        SpeedLevelModel.findOne({ _id: ObjectId(id) }, {}, (err, speed) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (speed) {
                speed.remove();
                res.send({
                    message: "success.",
                    data: {
                        speedLevel: speed
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
        SpeedLevelModel.updateOne({ _id: id }, params, { upsert: true }, (err, speed) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({
                    message: "success.",
                    data: {
                        speedLevel: speed
                    }
                });
            }
        });
    },
    show: function (req, res, next) {
        let id = req.params.id;
        SpeedLevelModel.findOne({ _id: ObjectId(id) }, {}, (err, speed) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (speed) {
                res.send({
                    message: "success.",
                    data: {
                        speedLevel: speed
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
}