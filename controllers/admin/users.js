const userModel = require('../../models/users-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
const fs = require('fs')

module.exports = {
    index: async function (req, res, next) {
        var _page = parseInt(req.query.page) || 1;
        var _limit = parseInt(req.query.limit) || 10;
        var skip = (_page - 1) * _limit;
        let searchField = req.query.search;
        const docCount = await userModel.countDocuments({})

        if (searchField === undefined) {
            userModel.find({}
            ).skip(skip)
                .limit(_limit)
                .sort({ created_at: -1 })
                .exec(function (err, data) {
                    if (err) {
                        res.send(err);

                    }
                    else {
                        res.send({
                            count: docCount,
                            message: "users  fetched successfully",
                            data: {
                                user: data
                            }
                        })
                    }
                })

        }
        else {
            userModel.find({ firstName: { $regex: searchField, $options: '$i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "users searched successfully",
                        data: {
                            user: data
                        }
                    });
                }

            })
        }
    },
    delete: async function (req, res, next) {
        let id = req.params.id;
        let params = req.body;
        await userModel.findOne({ _id: id }, {},
            (err, user) => {
                if (user.image !== undefined) {
                    fs.unlink(`./public/img/${user.image}`, (err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('file dlete')
                        }
                    })
                }

                console.log(user)

            }
        )


        userModel.findOne({ _id: ObjectId(id) }, {}, (err, user) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (user) {
                user.remove();
                res.send({
                    message: "success.",
                    data: {
                        user: user
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    },
    upsert: async function (req, res, next) {
        if (req.body.password != req.body.confirm_password) {
            res.status(200);
            res.json({
                success: false,
                errors: { password: { message: "Password confirmation failed" } }
            });
        }
        let id = req.params.id;
        if (req.file) {
            await userModel.findOne({ _id: id }, {},
                (err, user) => {
                    if (user.image !== undefined) {
                        fs.unlink(`./public/img/${user.image}`, (err) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log('file dlete')
                            }
                        })
                    }

                    console.log(user)

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

        userModel.findOneAndUpdate({ _id: id }
            , params, { upsert: true }, (err, user) => {
                if (err) {

                    console.log("Error in saving new user", err);
                    var errors = err.errors;
                    if (err.errors == undefined) {
                        errors = {
                            email: { message: "Email and user name should be unique" }
                        };
                    }
                    res.status(200);
                    return res.json({
                        success: false,
                        errors: errors,
                        message: err.errmsg
                    });


                } else {
                    res.send({
                        success: true,
                        data: {
                            user: user
                        }
                    });
                }
            });
    },
    show: function (req, res, next) {
        let id = req.params.id;
        userModel.findOne({ _id: ObjectId(id) }, {}, (err, user) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (user) {
                res.send({
                    message: "success.",
                    data: {
                        user: user
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
}