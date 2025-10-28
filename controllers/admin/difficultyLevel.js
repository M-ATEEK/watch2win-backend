const DifficultyLevelModel = require('../../models/difficultiesLevel-model');
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
            var newDifficulty = new DifficultyLevelModel({
                name: req.body.name,
                points:req.body.points
            });
            newDifficulty.save(function (err) {
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
                        difficulty: newDifficulty,
                        message: "saved successfully!"
                    }
                });
            });
        }
    },
    index: async function (req, res, next) {
        let all= req.query.all;
        var _page = parseInt(req.query.page) || 1;
        var _limit = parseInt(req.query.limit) || 10;
        var skip = (_page - 1) * _limit;
        let searchField = req.query.search;
        if (searchField === undefined) {
            if(all){
                const docCount = await DifficultyLevelModel.countDocuments({})

                DifficultyLevelModel.find({})
                .sort({created_at:-1})
                .exec(function(err, data) {
                    if(err){
                        res.send(err);
                    }
                     else {
                        res.send({
                            count:docCount,
                            message: "ALL fetched successfully",
                            data: {
                                difficulty: data
                            }
                        });
                    }
                })
            }
            else{
                const docCount = await DifficultyLevelModel.countDocuments({})

                DifficultyLevelModel.find({})
            .skip(skip)
            .limit(_limit)
            .sort({created_at:-1})
            .exec(function(err, data) {
                if(err){
                    res.send(err);
                }
                 else {
                    res.send({
                        count:docCount,
                        message: "fetched successfully",
                        data: {
                            difficulty: data
                        }
                    });
                }
            })
            }
            
        }
        else {
            DifficultyLevelModel.find({ name: { $regex: searchField, $options: '$i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: " searched successfully",
                        data: {
                            difficulty: data
                        }
                    });
                }

            })
        }
    },
    delete: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        DifficultyLevelModel.findOne({ _id: ObjectId(id) }, {}, (err, difficulty) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (difficulty) {
                difficulty.remove();
                res.send({
                    message: "success.",
                    data: {
                        difficulty: difficulty
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
        DifficultyLevelModel.updateOne({ _id: id }, params, { upsert: true }, (err, difficulty) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({
                    message: "success.",
                    data: {
                        difficulty: difficulty
                    }
                });
            }
        });
    },
    show: function (req, res, next) {
        let id = req.params.id;
        DifficultyLevelModel.findOne({ _id: ObjectId(id) }, {}, (err, difficulty) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (difficulty) {
                res.send({
                    message: "success.",
                    data: {
                        difficulty: difficulty
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
}