const activityModel = require('../../models/activity-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');

module.exports = {
    create: function (req, res, next) {
        var newActivity = new activityModel({
            user_id: req.user._id,
            type: req.body.type,
            video_id: req.body.video_id || null,
            drill_id: req.body.drill_id || null,
        })
        newActivity.save(function (err) {
            if (err) {
                console.log("Error in saving new activity", err);
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
                    activity: newActivity,
                    message: "activity  saved successfully!"
                }
            });
        });
    },
    index: async function (req, res, next) {
        var _page = parseInt(req.query.page) || 1;
        var _limit = parseInt(req.query.limit) || 10;
        var skip = (_page - 1) * _limit;
        const docCount = await activityModel.countDocuments({})

        activityModel.find({ user_id: req.user._id })
            .skip(skip)
            .limit(_limit)
            .sort({ createdAt: -1 })
            .populate({
                path: 'drill_id',
                model: 'drills'
            })
            .exec(function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "Activities",
                        data: {
                            activity: data
                        }
                    });
                }
            })
    },
    getActivity:function(req,res){
        let id=req.params.id;
       activityModel.find({user_id:id})
       .populate({
           path:"user_id",
           model:"user"
       })
       .populate({
           path:"drill_id",
           model:"drills"
       })
       .sort({createdAt:-1})
       .exec(function(err,activity){
           if(err){
               res.send(err)
           }
           else{
               res.send({
                   activity:activity
               })
           }
       })
       }
}
