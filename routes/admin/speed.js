var express = require("express");
var router = express.Router();
var speedController = require("../../controllers/admin/speedLevel");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");

router.post(
    "/admin/speed",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    speedController.create
);
router.get(
    "/admin/speed",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    speedController.index
);

router.delete(
    "/admin/speed/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   speedController.delete
);

router.post(
    "/admin/speed/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
    [
        check("name")
            .not()
            .isEmpty()
            .escape(),
            check("points")
            .not()
            .isEmpty()
            .escape(),
            check("condition")
            .not()
            .isEmpty()
            .escape(),
    ],
    speedController.upsert
);

router.get(
    "/admin/speed/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   speedController.show
);

module.exports = router;