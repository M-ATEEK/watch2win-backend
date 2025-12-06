const athleteModel = require('../../models/athlete-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
var fs = require("fs");

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
            if (req.file) {
                var newAthlete = new athleteModel({
                    name: req.body.name,
                    image: req.file.filename
                });
            }
            else {
                var newAthlete = new athleteModel({
                    name: req.body.name,
                });
            }

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
    index: async function (req, res, next) {
        let all=req.query.all;
        var _page = parseInt(req.query.page) || 1;
        var _limit = parseInt(req.query.limit) || 10;
        var skip = (_page - 1) * _limit;
        let searchField = req.query.search;
        if (searchField === undefined) {
            if(all){
                const docCount = await athleteModel.countDocuments({})
                athleteModel.find({})
                    .sort({ created_at: -1 })
                    .exec(function (err, data) {
                        if (err) {
                            res.send(err);
    
                        }
                        else {
                            res.send({
                                count: docCount,
                                message: "All athlete fethch successfully",
                                data: {
                                    athlete: data
                                }
                            });
                        }
                    })
            }
            else{
                const docCount = await athleteModel.countDocuments({})
                athleteModel.find({})
                    .skip(skip)
                    .limit(_limit)
                    .sort({ created_at: -1 })
                    .exec(function (err, data) {
                        if (err) {
                            res.send(err);
    
                        }
                        else {
                            res.send({
                                count: docCount,
                                message: "athlete fethch successfully",
                                data: {
                                    athlete: data
                                }
                            });
                        }
                    }) 
            }
           
        }
        else {
            athleteModel.find({ name: { $regex: searchField, $options: 'i' } }, (err, data) => {
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
    delete: async function (req, res, next) {
        let id = req.params.id;
        athleteModel.findOne({ _id: ObjectId(id) }, {}, async(err, athlete) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (athlete) {
                await athlete.remove();
                if (athlete.image !== undefined) {
                  await  fs.unlink(`./public/img/${athlete.image}`, (err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('file dlete')
                        }
                    })
                }
                const docCount = await athleteModel.countDocuments({});
                res.send({
                    message: "success.",
                    data: {
                        count:docCount,
                        athlete: athlete
                    }
                });
            } else {
                res.send({
                    message:"athlete does not xist"
                });
            }
        });
    },
    upsert: async function (req, res, next) {
        let id = req.params.id;
        //let params = req.body;
        if (req.file) {
            await athleteModel.findOne({ _id: id }, {},
                (err, athlete) => {
                    if (athlete.image !== undefined) {
                        fs.unlink(`./public/img/${athlete.image}`, (err) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log('file dlete')
                            }
                        })
                    }

                    console.log(athlete)

                }
            )

            var params = {
                ...req.body,
                image: req.file.filename
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