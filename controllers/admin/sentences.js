// var Admin = require('../../models/admin-model.js'); // Removed in cleanup
const sentenceModel = require('../../models/sentences-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');

module.exports = {
    index: function(req, res, next) {
        sentenceModel.find({}, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send({
                    message: "sentences fetched successfully",
                    data: {
                        sentences: data
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
        sentenceModel.updateOne({_id: id}, params, {upsert: true} , (err, sentence) => {
            if (err) {
             res.sendStatus(500);
           } else {
                res.send({
                    message: "success.",
                    data: {
                        sentence: sentence
                    }
                });
           }
        });
    },

    delete: function (req, res, next) {
        let id = req.params.id;

        sentenceModel.findOne({_id: ObjectId(id)}, {}, (err, sentence) => {
            if (err) {
                res.sendStatus(500);
            }
            else if(sentence) {
                sentence.remove();
                res.send({
                    message: "success.",
                    data: {
                        sentence: sentence
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    },

    show: function (req, res, next) {

        let id = req.params.id;
        sentenceModel.findOne({_id: ObjectId(id)}, {}, (err, sentence) => {
            if (err) {
                res.sendStatus(500);
            }
            else if(sentence) {
                res.send({
                    message: "success.",
                    data: {
                        sentence: sentence
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    }
};
