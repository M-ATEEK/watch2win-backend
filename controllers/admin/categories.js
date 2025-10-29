const categoriesModel = require('../../models/categories-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
const fs = require('fs')

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
                var newCategory = new categoriesModel({
                    name: req.body.name,
                    image: req.file.filename
                });
            }
            else {
                var newCategory = new categoriesModel({
                    name: req.body.name,

                });
            }

            newCategory.save(function (err) {
                if (err) {
                    console.log("Error in saving new category", err);
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
                        category: newCategory,
                        message: "category with ID_${data._id} saved successfully!"
                    }
                });
            });
        }
    },
    index: async function (req, res, next) {
        let all=req.query.all
        var _page = parseInt(req.query.page) || 1;
        var _limit = parseInt(req.query.limit) || 10;
        var skip = (_page - 1) * _limit;
        let searchField = req.query.search;
        if (searchField === undefined) {
            if(all){
                const docCount = await categoriesModel.countDocuments({})
                categoriesModel.find({})
                    .sort({ created_at: -1 })
                    .exec(function (err, category) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send({
                                count: docCount,
                                message: "All categories fetched successfully",
                                data: {
                                    category: category
                                }
                            });
                        }
                    })
            }
            else{
                const docCount = await categoriesModel.countDocuments({})
            categoriesModel.find({})
                .skip(skip)
                .limit(_limit)
                .sort({ created_at: -1 })
                .exec(function (err, category) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            count: docCount,
                            message: "categories fetched successfully",
                            data: {
                                category: category
                            }
                        });
                    }
                })
            }
            
        }
        else {
            categoriesModel.find({ name: { $regex: searchField, $options: '$i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "category searched successfully",
                        data: {
                            category: data
                        }
                    });
                }

            })
        }
    },
    delete: async function (req, res, next) {
        let id = req.params.id;

        categoriesModel.findOne({ _id: ObjectId(id) }, {}, async(err, category) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (category) {
               await category.remove();
               if (category.image !== undefined) {
               await fs.unlink(`./public/img/${category.image}`, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('file dlete')
                    }
                })
            }
                const docCount = await categoriesModel.countDocuments({});
                res.send({
                    message: "success.",
                    data: {
                        count:docCount,
                        category: category
                    }
                });
            } else {
                res.send({
                    message:"category doest not exist "
                });
            }
        });
    },
    upsert: async function (req, res, next) {
        let id = req.params.id;
        // let params = req.body;
        if (req.file) {
            await categoriesModel.findOne({ _id: id }, {},
                (err, category) => {
                    if (category.image !== undefined) {
                        fs.unlink(`./public/img/${category.image}`, (err) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log('file dlete')
                            }
                        })
                    }

                    console.log(category)

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
        categoriesModel.updateOne({ _id: id }, params, { upsert: true }, (err, category) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({
                    message: "success.",
                    data: {
                        category: category
                    }
                });
            }
        });
    },
    show: function (req, res, next) {
        let id = req.params.id;
        categoriesModel.findOne({ _id: ObjectId(id) }, {}, (err, category) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (category) {
                res.send({
                    message: "success.",
                    data: {
                        category: category
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
}