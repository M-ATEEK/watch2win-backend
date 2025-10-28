const userModel = require('../../models/users-model');
const athleteModel = require('../../models/athlete-model');
const categoriesModel = require('../../models/categories-model');
const activityModel = require('../../models/activity-model');
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
const {OAuth2Client}=require('google-auth-library')
var jwt = require("jwt-simple");
const config = require("../../config");
const fs = require('fs');
const { userInfo } = require('os');
const { response } = require('express');
const UsersModel = require('../../models/users-model');
const fetch = require('node-fetch');

const client=new OAuth2Client(config.CLIENT_ID)

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


        userModel.findOne({ _id: ObjectId(id) }, {}, async (err, user) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (user) {
                await user.remove();
                const docCount = await userModel.countDocuments({});

                res.send({
                    message: "success.",
                    data: {
                        count: docCount,
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
            return;
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
    // me api, get all the user info from users collection of the current loged in user, get api, same as show also return activities aray
    me: async function(req,res,next){
      let user = await userModel.aggregate([
            { $match: { _id: ObjectId('5f5925967a5d0242fb4513eb') } },
            { "$unwind": "$watchLaterDrillVideos" },
            { $lookup: { from: "drills", localField: "watchLaterDrillVideos", foreignField: "videos._id", as: "watchLaterDrillVideo"  } },
            { "$unwind": "$watchLaterDrillVideo" },
            { "$unwind": "$watchLaterDrillVideo.videos" },
            { $match: { $expr:{ $eq:["$watchLaterDrillVideos", "$watchLaterDrillVideo.videos._id"] } } },
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT", {watchLaterDrillVideo: "$watchLaterDrillVideo.videos"} ] } } },
            { "$group": {"_id": "$_id","watchLaterDrillVideo": { "$push": "$watchLaterDrillVideo" }, "document":{"$first":"$$ROOT"} }},
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$document", {watchLaterDrillVideo: "$watchLaterDrillVideo"} ] } } },

            { "$unwind": "$favouriteDrillVideos" },
            { $lookup: { from: "drills", localField: "favouriteDrillVideos", foreignField: "videos._id", as: "favouriteDrillVideo"  } },
            { "$unwind": "$favouriteDrillVideo" },
            { "$unwind": "$favouriteDrillVideo.videos" },
            { $match: { $expr:{ $eq:["$favouriteDrillVideos", "$favouriteDrillVideo.videos._id"] } } },
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT", {favouriteDrillVideo: "$favouriteDrillVideo.videos"} ] } } },
            { "$group": {"_id": "$_id","favouriteDrillVideo": { "$push": "$favouriteDrillVideo" }, "document":{"$first":"$$ROOT"} }},
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$document", {favouriteDrillVideo: "$favouriteDrillVideo"} ] } } },
            
            { "$unwind": "$watchedVideos" },
            { $lookup: { from: "drills", localField: "watchedVideos.drill_id", foreignField: "_id", as: "watchedVideos.drill_id"  } },
            { $lookup: { from: "difficultylevels", localField: "watchedVideos.diffculty_id", foreignField: "_id", as: "watchedVideos.diffculty_id"  } },
            { $lookup: { from: "speedlevels", localField: "watchedVideos.speed_level_id", foreignField: "_id", as: "watchedVideos.speed_level_id"  } },
            { "$group": {"_id": "$_id","watchedVideos": { "$push": "$watchedVideos" }, "document":{"$first":"$$ROOT"} }},
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$document", {watchedVideos: "$watchedVideos"} ] } } }
        ]);
      let activity=await  activityModel.find({user_id:req.user._id},{})
      res.send({
        data: {
            user: user,
            activity: activity,
        }
    })
     
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
    },
    addToFvorite: function (req, res, next) {
        let isAdded = req.body.isAdded
        let video = req.body.favouriteDrillVideos
        if (isAdded) {
            userModel.update(
                { _id: req.user._id },
                { $push: { favouriteDrillVideos: video } },
                (err, done) => {
                    if (err) {

                    }
                    else {
                        res.json({
                            success: true,
                            data: {
                                drills: done,
                                message: "video added to favorite"
                            }
                        });
                    }
                }
            )
        }
        else {
            userModel.update(
                { _id: req.user._id },
                { $pull: { favouriteDrillVideos: { $in: video } } },
                // { multi: true }
                (err, done) => {
                    if (err) {

                    }
                    else {
                        res.json({
                            success: true,
                            data: {
                                drills: done,
                                message: "video deleted from favorite"
                            }
                        });
                    }
                })
        }
    },
    addToWatchLater: function (req, res, next) {
        let isAdded = req.body.isAdded
        let video = req.body.watchLaterDrillVideos
        if (isAdded) {
            userModel.update(
                { _id: req.user._id },
                { $push: { watchLaterDrillVideos: video } },
                (err, done) => {
                    if (err) {

                    }
                    else {
                        res.json({
                            success: true,
                            data: {
                                drills: done,
                                message: "video added to watch later"
                            }
                        });
                    }
                }
            )
        }
        else {
            userModel.update(
                { _id: req.user._id },
                { $pull: { watchLaterDrillVideos: { $in: video } } },
                // { multi: true }
                (err, done) => {
                    if (err) {

                    }
                    else {
                        res.json({
                            success: true,
                            data: {
                                drills: done,
                                message: "video remove from watch later"
                            }
                        });
                    }
                })
        }

    },
    search: async function (req, res, next) {
        let keyword = req.query.keyword;
        let users = await userModel.find({ firstName: { $regex: keyword, $options: '$i' } })
        let category = await categoriesModel.find({ name: { $regex: keyword, $options: '$i' } })
        let athlete = await athleteModel.find({ name: { $regex: keyword, $options: '$i' } })
        res.send({
            data: {
                users: users,
                categories: category,
                athlete: athlete
            }
        })
    },
    googlelogin:function(req,res,next){
        let {tokenId,source}=req.body;
        client.verifyIdToken({idToken:tokenId, audience:config.CLIENT_ID})
        .then(response=>{
            const {email_verified,given_name,family_name,email,picture}=response.payload;
            if(email_verified){
                UsersModel.findOne({email}).exec((err,user)=>{
                    if(err){
                        return res.status(400).json({
                        message:"something wrong"
                        })
                    }
                    else{
                        if(user){
                            var token = jwt.encode(user, config.secret);
                            res.json({
                              success: true,
                              data: { user: user, token: "JWT " + token },
                              message: "Log in successfully"
                            });

                        }else{
                            let password=email+Math.random();
                            var newUser = new userModel({
                                firstName: given_name,
                                lastName: family_name,
                                userName: given_name,
                                email: email,
                                password: password,
                                roles: "user", 
                                image: picture,
                                source:source
                              });
                              newUser.save((err,data)=>{
                                  if(err){
                                    return res.status(400).json({
                                        message:"something wrong"
                                        })
                                  }
                                  else{
                                    var token = jwt.encode(data, config.secret);
                                    res.json({
                                      success: true,
                                      data: {
                                        user: data,
                                        token: "JWT " + token,
                                        message: "User with ID_${data._id} saved successfully!"
                                      }
                                    });
                                  }
                              })
                        }
                    }
                })
            }
        })
    },
    facebooklogin:function(req,res,next){
        const{userID,source,accessToken}=req.body
        let urlGraphFacebook=`https://graph.facebook.com/v2.11/${userID}/?fields=id,email,first_name,last_name,name,picture&access_token=${accessToken}`
        fetch(urlGraphFacebook,{
            method:"GET"
        }).then(response=>response.json())
        .then((response)=>{
             const {email,name,first_name,last_name}=response
             const{url}=response.picture.data
             UsersModel.findOne({email}).exec((err,user)=>{
                if(err){
                    return res.status(400).json({
                    message:"something wrong"
                    })
                }else{
                    if(user){
                        var token = jwt.encode(user, config.secret);
                        res.json({
                          success: true,
                          data: { user: user, token: "JWT " + token },
                          message: "Log in successfully"
                        });

                    }else{
                        let password=email+Math.random();
                        var newUser = new userModel({
                            firstName: first_name,
                            lastName: last_name,
                            userName: name,
                            email: email,
                            password: password,
                            roles: "user", 
                            image: url,
                            source:source
                          });
                          newUser.save((err,data)=>{
                              if(err){
                                return res.status(400).json({
                                    message:"something wrong"
                                    })
                              }
                              else{
                                var token = jwt.encode(data, config.secret);
                                res.json({
                                  success: true,
                                  data: {
                                    user: data,
                                    token: "JWT " + token,
                                    message: "User with ID_${data._id} saved successfully!"
                                  }
                                });
                              }
                          })
                    } 
                }
            })
        })
    }
}