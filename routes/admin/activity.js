var express = require("express");
var router = express.Router();
var activityController = require("../../controllers/admin/activity");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");

router.post(
    "/admin/activity",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    activityController.create
);
router.get(
    "/admin/activity",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    activityController.index
);


module.exports = router;
