var express = require("express");
var router = express.Router();
var athleteController = require("../../controllers/admin/athlete");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");


router.post(
    "/admin/athlete",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    athleteController.create
);
router.get(
    "/admin/athlete",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    athleteController.index
);

router.delete(
    "/admin/athlete/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    athleteController.delete
);

router.post(
    "/admin/athlete/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    [
        check("name")
            .not()
            .isEmpty()
            .escape(),
    ],
    athleteController.upsert
);

router.get(
    "/admin/athlete/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    athleteController.show
);

module.exports = router;

