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
    cb(null,'./public/img/')
  },
  filename:function(req,file,cb){
   cb(null, new Date().toISOString() + file.originalname);
  }
})
const upload=multer({storage:storage})

router.post(
    "/admin/drills",
    upload.single('thumbnail'),
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    drillsController.create
);
router.get(
    "/admin/drills",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   drillsController.index
);

router.post(
    "/admin/drills/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    [
        check("name")
            .not()
            .isEmpty()
            .escape(),
    ],
    upload.single('thumbnail'),
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

module.exports=router;
