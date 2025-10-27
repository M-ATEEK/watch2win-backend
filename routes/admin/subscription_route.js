var express = require("express");
var router = express.Router();
var subscriptionController = require("../../controllers/admin/subscriptions");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");

router.post(
    "/admin/subscription",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    subscriptionController.create
);
router.get(
    "/admin/subscription",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    subscriptionController.index
);

router.delete(
    "/admin/subscription/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   subscriptionController.delete
);

router.post(
    "/admin/subscription/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
    [
        check("name")
            .not()
            .isEmpty()
            .escape(),
            check("price")
            .not()
            .isEmpty()
            .escape(),
            check("details")
            .not()
            .isEmpty()
            .escape(),
    ],
    subscriptionController.upsert
);

router.get(
    "/admin/subscription/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   subscriptionController.show
);

module.exports = router;