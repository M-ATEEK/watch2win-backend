const athleteModel = require('../../models/athlete-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
module.exports = {

    create: function (req, res, next) {

        if (!req.body.name) {
            res.status(200);
            res.json({
                success: false,
                errors: { email: { message: "name is required" } }
            });
        }
        else {
            var newAthlete = new athleteModel({
                name: req.body.name,
                image: req.file ? req.file.filename : undefined
            });
            newAthlete.save(function (err) {
                if (err) {
                    console.log("Error in saving new athlete", err);
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
                        athlete: newAthlete,
                        message: "athlete with ID_${data._id} saved successfully!"
                    }
                });
            });
        }
    },
    index: function (req, res, next) {
        let searchField = req.query.search;

        if (searchField === undefined) {
            athleteModel.find({}, (err, athlete) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "athlete fetched successfully",
                        data: {
                            athlete: athlete
                        }
                    });
                }
            });
        }
        else {
            athleteModel.find({ name: { $regex: searchField, $options: '$i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "athlete searched successfully",
                        data: {
                            athlete: data
                        }
                    });
                }

            })
        }
    },
    delete: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        athleteModel.findOne({ _id: ObjectId(id) }, {}, (err, athlete) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (athlete) {
                athlete.remove();
                res.send({
                    message: "success.",
                    data: {
                        athlete: athlete
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
        athleteModel.updateOne({ _id: id }, params, { upsert: true }, (err, athlete) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({
                    message: "success.",
                    data: {
                        athlete: athlete
                    }
                });
            }
        });
    },
    show: function (req, res, next) {
        let id = req.params.id;
        athleteModel.findOne({ _id: ObjectId(id) }, {}, (err, athlete) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (athlete) {
                res.send({
                    message: "success.",
                    data: {
                        athlete: athlete
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
}

