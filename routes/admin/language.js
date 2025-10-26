var express = require("express");
var router = express.Router();
var languageController = require("../../controllers/admin/languages");
var passport = require("passport");
const { check } = require("express-validator");
var languagePolicy = require("../../policies/languages.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");

router.get(
    "/admin/languages",
    passport.authenticate("jwt", { session: false }),
    languagePolicy.isAllowed,
    languageController.index
);

router.get(
    "/admin/languages/:id",
    passport.authenticate("jwt", { session: false }),
    languagePolicy.isAllowed,
    languageController.show
);


router.post(
    "/admin/languages/:id",
    passport.authenticate("jwt", { session: false }),
    languagePolicy.isAllowed,
    [
        check("title")
            .not()
            .isEmpty()
            .escape(),
        check("layout_direction")
            .not()
            .isEmpty()
            .escape(),
        check("language_code")
            .not()
            .isEmpty()
            .escape(),
        check("is_active")
            .not()
            .isEmpty()
            .escape(),
        check("is_default")
            .not()
            .isEmpty()
            .escape()
    ],
    languageController.upsert
);

router.delete(
    "/admin/languages/:id",
    passport.authenticate("jwt", { session: false }),
    languagePolicy.isAllowed,
    languageController.delete
);


module.exports = router;
