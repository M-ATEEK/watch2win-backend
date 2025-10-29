const userModel = require('../../models/users-model');
const athleteModel = require('../../models/athlete-model');
const categoriesModel = require('../../models/categories-model');
const activityModel = require('../../models/activity-model');
const subscriptios = require('../../models/subscriptions-model')
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library')
var jwt = require("jwt-simple");
const config = require("../../config");
const fs = require('fs');
const { userInfo } = require('os');
const { response } = require('express');
var moment = require('moment');
const UsersModel = require('../../models/users-model');
const fetch = require('node-fetch');
var braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "s7c9tzx9vtfq8zsp",
    publicKey: "5xk3yb84xxprw66n",
    privateKey: "4e6f3d602fd826873a2f813801c4ef17"
});

const client = new OAuth2Client(config.CLIENT_ID)

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
                        }
                    })
                }
                
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
                            }
                        })
                    }
                    
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
        let userObj = req.user
        let aggregation = [{ $match: { _id: ObjectId(req.user._id) } }];
        if (userObj.favouriteDrillVideos && userObj.favouriteDrillVideos.length > 0) {
            let agg = [{ "$unwind": {path: "$favouriteDrillVideos", preserveNullAndEmptyArrays: true} },
            { $lookup: { from: "drills", localField: "favouriteDrillVideos.drill_id", foreignField: "_id", as: "favouriteDrillVideos.drill_id"  } },
            {"$group": {"_id": "$_id","favouriteDrillVideos": { "$push": "$favouriteDrillVideos" }, "document":{"$first":"$$ROOT"} }},
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$document", {favouriteDrillVideos: "$favouriteDrillVideos"} ] } } }
            ];

            agg.forEach(ag => {
                aggregation.push(ag);
            });
        }

        if (userObj.watchLaterDrillVideos && userObj.watchLaterDrillVideos.length > 0) {
            let agg = [{ "$unwind": {path: "$watchLaterDrillVideos", preserveNullAndEmptyArrays: true} },
            { $lookup: { from: "drills", localField: "watchLaterDrillVideos.drill_id", foreignField: "_id", as: "watchLaterDrillVideos.drill_id"  } },
            {"$group": {"_id": "$_id","watchLaterDrillVideos": { "$push": "$watchLaterDrillVideos" }, "document":{"$first":"$$ROOT"} }},
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$document", {watchLaterDrillVideos: "$watchLaterDrillVideos"} ] } } }
            ];

            agg.forEach(ag => {
                aggregation.push(ag);
            });
        }

        if (userObj.watchedVideos && userObj.watchedVideos.length > 0) {
            let agg = [{ "$unwind": {path: "$watchedVideos", preserveNullAndEmptyArrays: true} },
            { $lookup: { from: "drills", localField: "watchedVideos.drill_id", foreignField: "_id", as: "watchedVideos.drill_id"  } },
            { $lookup: { from: "difficultylevels", localField: "watchedVideos.diffculty_id", foreignField: "_id", as: "watchedVideos.diffculty_id"  } },
            { $lookup: { from: "speedlevels", localField: "watchedVideos.speed_level_id", foreignField: "_id", as: "watchedVideos.speed_level_id"  } },
            {"$group": {"_id": "$_id","watchedVideos": { "$push": "$watchedVideos" }, "document":{"$first":"$$ROOT"} }},
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$document", {watchedVideos: "$watchedVideos"} ] } } }
            ];

            agg.forEach(ag => {
                aggregation.push(ag);
            });
        }

       if (userObj.following && userObj.following.length > 0) {
            let agg = [{ "$unwind": {path: "$following", preserveNullAndEmptyArrays: true} },
            { $lookup: { from: "users", localField: "following", foreignField: "_id", as: "following"  } },
            {"$group": {"_id": "$_id","following": { "$push": "$following" }, "document":{"$first":"$$ROOT"} }},
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$document", {following: "$following"} ] } } }
            ];

            agg.forEach(ag => {
                aggregation.push(ag);
            });
        } 

    let user = await userModel.aggregate(aggregation)
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
        let video_id = req.body.video_id
        let drill_id = req.body.drill_id
        if (isAdded) {
            userModel.update(
                { _id: req.user._id },
                { $push: { favouriteDrillVideos: { video_id, drill_id } } },
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
                { $pull: { favouriteDrillVideos: { video_id, drill_id } } },
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
        let video_id = req.body.video_id
        let drill_id = req.body.drill_id
        if (isAdded) {
            userModel.update(
                { _id: req.user._id },
                { $push: { watchLaterDrillVideos: { video_id, drill_id } } },
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
                { $pull: { watchLaterDrillVideos: { video_id: ObjectId(video_id), drill_id: ObjectId(drill_id) } } },
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
    followUser:function(req,res){
        let isAdded = req.body.isAdded
        let userId = req.body.following
        
        if (isAdded) {
            userModel.update(
                { _id: req.user._id },
                { $push: { following: userId } },
                (err, done) => {
                    if (err) {

                    }
                    else {
                        res.json({
                            success: true,
                            data: {
                                drills: done,
                                message: "follow user added"
                            }
                        });
                    }
                }
            )
        }
        else {
            userModel.update(
                { _id: req.user._id },
                { $pull: { following: { $in: userId } } },
                // { multi: true } 
                (err, done) => {
                    if (err) {

                    }
                    else {
                        res.json({
                            success: true,
                            data: {
                                drills: done,
                                message: "follow user deleted"
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
    googlelogin: function(req,res,next){
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
    facebooklogin: function(req,res,next){
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
    },
    tokenGenerate: function (req, res) {
        gateway.clientToken.generate({}, (err, response) => {
            res.send({ token: response.clientToken });
        });
    },
    transection: async function (req, res) {
        const id = req.user._id
        const data = req.body;
        const sub = await subscriptios.findOne({ _id: data.sub_id })
        await gateway.transaction.sale({
            amount: `${sub.price}`,
            paymentMethodNonce: data.data.nonce,
            deviceData: data.data.detail,
            options: {
                submitForSettlement: true
            }
        }, async (err, result) => {
            if (err) {
                res.send(500)
            }
            else {
                var start = moment(req.user.subscribeDetail && req.user.subscribeDetail.subscribeDate);
                var current = moment().startOf('minute');
                const duration = moment.duration(current.diff(start)).asDays()
                if (req.user.subscribeDetail && req.user.subscribeDetail.subscribe && duration <= '30') {
                    res.send({
                        message: 'already subscribe'
                    })
                }
                else {
                    if (result.success) {
                        let body = {
                            subscribeDetail: {
                                subscribe: true,
                                subscribeDate: result.transaction.createdAt
                            },
                            transection: {
                                transection_id: result.transaction.id,
                                date: result.transaction.createdAt,
                                amount: result.transaction.amount,
                                cardType: result.transaction.creditCard.cardType,
                                maskedNumber: result.transaction.creditCard.maskedNumber
                            },
                        }
                        await userModel.findOneAndUpdate({ _id: id }, body, { new: true })
                        res.json({
                            message: result.success,
                            result: result
                        })
                    }
                    else {
                        res.json({
                            message: result.success,
                            result: result
                        })
                    }
                }
            }
        });
    },
    subscribeByMonth: async function (req, res) {
        const jan = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 1, 1), $gte: new Date(moment().format('YYYY'), 0, 1 + 1) } }).countDocuments()
        const feb = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 2, 1), $gte: new Date(moment().format('YYYY'), 1, 1 + 1) } }).countDocuments()
        const mar = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 3, 1), $gte: new Date(moment().format('YYYY'), 2, 1 + 1) } }).countDocuments()
        const apr = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 4, 1), $gte: new Date(moment().format('YYYY'), 3, 1 + 1) } }).countDocuments()
        const may = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 5, 1), $gte: new Date(moment().format('YYYY'), 4, 1 + 1) } }).countDocuments()
        const jun = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 6, 1), $gte: new Date(moment().format('YYYY'), 5, 1 + 1) } }).countDocuments()
        const jul = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 7, 1), $gte: new Date(moment().format('YYYY'), 6, 1 + 1) } }).countDocuments()
        const aug = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 8, 1), $gte: new Date(moment().format('YYYY'), 7, 1 + 1) } }).countDocuments()
        const sep = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 9, 1), $gte: new Date(moment().format('YYYY'), 8, 1 + 1) } }).countDocuments()
        const oct = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 10, 1), $gte: new Date(moment().format('YYYY'), 9, 1 + 1) } }).countDocuments()
        const nov = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 11, 1), $gte: new Date(moment().format('YYYY'), 10, 1 + 1) } }).countDocuments()
        const dec = await userModel.find({ 'subscribeDetail.subscribe': true, "subscribeDetail.subscribeDate": { $lte: new Date(moment().format('YYYY'), 12, 1), $gte: new Date(moment().format('YYYY'), 11, 1 + 1) } }).countDocuments()

        res.send({
            jan,
            feb,
            mar,
            apr,
            may,
            jun,
            jul,
            aug,
            sep,
            oct,
            nov,
            dec
        })
    },
    subscribers: function (req, res) {
        userModel.find({ 'subscribeDetail.subscribe': true }).countDocuments()
            .exec(function (err, subscriberes) {
                if (err) {
                    res.send(500)
                }
                else {
                    res.send({
                        totalsubscribers: subscriberes
                    })
                }
            })
    },
    loginUser: function(req,res){
        const loginUser = req.user
        res.json({
            loginUser
        })
    }
}