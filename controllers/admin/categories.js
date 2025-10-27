const categoriesModel = require('../../models/categories-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
module.exports = {

     create:function(req,res,next){
        if (!req.body.name) {
            res.status(200);
            res.json({
              success: false,
              errors: { email: { message: "name is required" } }
            });
          } 
           else {
            var newCategory = new categoriesModel({
              name: req.body.name,
            });
            newCategory.save(function(err) {
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
     
    index: function(req, res, next) {
        categoriesModel.find({}, (err, category) => {
            if (err) {
                res.send(err);
            } else {
                res.send({
                    message: "categories fetched successfully",
                    data: {
                        category: category
                    }
                });
            }
        });
    },
    delete: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        categoriesModel.findOne({_id: ObjectId(id)}, {}, (err, category) => {
            if (err) {
                res.sendStatus(500);
            }
            else if(category) {
                category.remove();
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
    },
    upsert: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;
      if(id == 'new') {
        id = new ObjectId();
      } else {
        id = ObjectId(id);
      }
        categoriesModel.updateOne({_id: id}, params, {upsert: true}, (err, category) => {
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
        categoriesModel.findOne({_id: ObjectId(id)}, {}, (err, category) => {
            if (err) {
                res.sendStatus(500);
            }
            else if(category) {
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
