var express = require("express");
var router = express.Router();
var earningController = require("../../controllers/admin/earning");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");


router.get(
    "/admin/earning",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    earningController.index
)

module.exports = router;