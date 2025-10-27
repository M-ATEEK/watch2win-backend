const drillsModel = require('../../models/drills-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
const fs = require('fs');
const { populate } = require('../../models/drills-model');

module.exports = {

    create: function (req, res, next) {
  if (!req.body.name) {
    res.status(200);
    res.json({
        success: false,
        errors: { email: { message: "name is required" } }
    });
}
       
               if(req.file){
                var newDrill = new drillsModel({
                    name: req.body.name,
                    athlete: req.body.athlete,
                    category: req.body.category,
                    speedLevel: req.body.speedLevel,
                    difficultyLevel: req.body.difficultyLevel,
                    isPremium: req.body.isPremium,
                    thumbnail:req.file.filename
                });
               }
          else{
            var newDrill = new drillsModel({
                name: req.body.name,
                athlete: req.body.athlete,
                category: req.body.category,
                speedLevel: req.body.speedLevel,
                difficultyLevel: req.body.difficultyLevel,
                isPremium: req.body.isPremium,
            });
          }

        newDrill.save(function (err) {
            if (err) {
                console.log("Error in saving new drill", err);
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
                    drills: newDrill,
                    message: "drill with ID_${data._id} saved successfully!"
                }
            });
        });
    },
    index: async function (req, res, next) {
        var _page = parseInt(req.query.page) || 1;
        var _limit = parseInt(req.query.limit) || 10;
        var skip = (_page - 1) * _limit;
        let searchField = req.query.search;
        if (searchField === undefined) {
            const docCount = await drillsModel.countDocuments({})
            drillsModel.find({})
            .populate({
                path: 'athlete',
                model: 'athlete'
            }).populate({
                path: 'category',
                model: 'categories'
            }).populate({
                path: 'speedLevel',
                model: 'speedlevel'
            }).populate({
                path: 'difficultyLevel',
                model: 'difficultylevel'
            })
                .skip(skip)
                .limit(_limit)
                .sort({ created_at: -1 })
                .exec(function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            count: docCount,
                            message: "drills fetched successfully",
                            data: {
                                drills: data
                            }
                        });
                    }
                })
        }
        else {
            drillsModel.find({ name: { $regex: searchField, $options: '$i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "drills searched successfully",
                        data: {
                            drills: data
                        }
                    });
                }

            })
        }
    },

    upsert: async function (req, res, next) {
        let id = req.params.id;
        //let params = req.body;
        if (req.file) {
            await drillsModel.findOne({ _id: id }, {},
                (err, data) => {
                    console.log(data.thumbnail)
                    if (data.thumbnail !== undefined) {
                        fs.unlink(`./public/img/${data.thumbnail}`, (err) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log('file dlete')
                            }
                        })
                    }

                    console.log(data)

                }
            )

            var params = {
                ...req.body,
                thumbnail: req.file.filename
            }

        }
        else if (req.file === undefined) {
            var params = req.body
        }
        if (id == 'new') {
            id = new ObjectId();
        } else {
            id = ObjectId(id);
        }
        drillsModel.updateOne({ _id: id }, params, { upsert: true }, (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({
                    message: "success.",
                    data: {
                        drills: data
                    }
                });
            }
        });
    },
    delete: async function (req, res, next) {
        let id = req.params.id;
        let params = req.body;
        await drillsModel.findOne({ _id: id }, {},
            (err, data) => {
                if (data.thumbnail !== undefined) {
                    fs.unlink(`./public/img/${data.thumbnail}`, (err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('file dlete')
                        }
                    })
                }
                console.log(data)
            }
        )

        drillsModel.findOne({ _id: ObjectId(id) }, {}, async(err, data) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (data) {
               await data.remove();
                const docCount = await drillsModel.countDocuments({});
                res.send({
                    message: "success.",
                    data: {
                        count:docCount,
                        drills: data
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    },

    show: function (req, res, next) {
        let id = req.params.id;
        drillsModel.find({ _id: id }, function (err, user) { })
            .populate({
                path: 'athlete',
                model: 'athlete'
            }).populate({
                path: 'category',
                model: 'categories'
            }).populate({
                path: 'speedLevel',
                model: 'speedlevel'
            }).populate({
                path: 'difficultyLevel',
                model: 'difficultylevel'
            })

            .exec(function (err, data) {
                console.log(data)
                if (err) {
                    res.sendStatus(500);
                }
                else if (data) {
                    res.send({
                        message: "success.",
                        data: {
                            drills: data
                        }
                    });
                } else {
                    res.sendStatus(500);
                }
            })
    }
}
