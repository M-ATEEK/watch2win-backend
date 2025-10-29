const EarningModel = require('../../models/Earning-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
module.exports = {

    index: function (req, res, next) {
            EarningModel.find({}, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        
                            totalEarning: data
                    });
                }
            });
        
       
    },
}