// var Admin = require('../../models/admin-model.js'); // Removed in cleanup
const languageModel = require('../../models/language-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');

module.exports = {
    index: function(req, res, next) {
        languageModel.find({}, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send({
                    message: "languages fetched successfully",
                    data: {
                        languages: data
                    }
                });
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
        languageModel.updateOne({_id: id}, params, {upsert: true}, (err, language) => {
            if (err) {
             res.sendStatus(500);
           } else {
                res.send({
                    message: "success.",
                    data: {
                        language: language
                    }
                });
           }
        });
    },

    delete: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        languageModel.findOne({_id: ObjectId(id)}, {}, (err, language) => {
            if (err) {
                res.sendStatus(500);
            }
            else if(language) {
                language.remove();
                res.send({
                    message: "success.",
                    data: {
                        language: language
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    },

    show: function (req, res, next) {
        let id = req.params.id;
        languageModel.findOne({_id: ObjectId(id)}, {}, (err, language) => {
            if (err) {
                res.sendStatus(500);
            }
            else if(language) {
                res.send({
                    message: "success.",
                    data: {
                        language: language
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
};
