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
    index: async function (req, res, next) {
        let all=req.query.all;
        var _page = parseInt(req.query.page) || 1;
        var _limit = parseInt(req.query.limit) || 10;
        var skip = (_page - 1) * _limit;
        let searchField = req.query.search;
        if (searchField === undefined) {
            if(all){
                const docCount = await SpeedLevelModel.countDocuments({})
                SpeedLevelModel.find({})
                .sort({created_at:-1})
                .exec(function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            count:docCount,
                            message: "All fetched successfully",
                            data: {
                                speedLevel: data
                            }
                        });
                    }
                });     
            }
            else{
                const docCount = await SpeedLevelModel.countDocuments({})
                SpeedLevelModel.find({})
                .skip(skip)
                .limit(_limit)
                .sort({created_at:-1})
                .exec(function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            count:docCount,
                            message: "fetched successfully",
                            data: {
                                speedLevel: data
                            }
                        });
                    }
                });
            }
            
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
                res.send({
                    message:"speedLevel does not exist"
                });
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