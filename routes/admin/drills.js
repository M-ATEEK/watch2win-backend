var express = require("express");
var router = express.Router();
var drillsController = require("../../controllers/admin/drill");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");
const multer=require('multer');
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/drills/')
  },
  filename:function(req,file,cb){
   cb(null, new Date().toISOString() + file.originalname);
  }
})
const upload=multer({storage:storage})
var cpUpload = upload.fields([{ name: 'thumbnail', maxCount: 2 }, { name: 'video' }])
router.post(
    "/admin/drills",
    cpUpload,
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    drillsController.create
);
router.post(
    "/admin/drills/upload",
    cpUpload,
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    drillsController.videos
);
router.get(
    "/admin/drills",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   drillsController.index
);

router.post(
    "/admin/drills/:id",
    cpUpload,
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    [
        check("name")
            .not()
            .isEmpty()
            .escape(),
    ],
    drillsController.upsert
);
router.delete(
    "/admin/drills/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    drillsController.delete
);
router.get(
    "/admin/drills/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   drillsController.show
);

router.post(
    "/user/points",
    passport.authenticate("jwt", { session: false }),
    drillsController.points

)
router.post(
    "/totallikes",
    passport.authenticate("jwt", { session: false }),
    drillsController.totalLikes

)

// write post api and pass drill_id, video_id, diffculty_id, speed_level_id
// get diffuclty obj
//get speedlevel =Obj from db
// pervideoPoint = sp.points / sp.condition
//get user detail from req.user
// if user.watchedVideo do not have object against video_id, drill_il then push with 1 watched
// else if already have object in this array with video_id and drill id then increament watched total

// user.points += pervideoPoints
// if (sp.condition == watchedVideoObj.watched_count) then user.points += diff.points
// user me userpoints save kr do. .save()
module.exports=router; 