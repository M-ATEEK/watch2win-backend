var express = require("express");
var router = express.Router();
var difficultyController = require("../../controllers/admin/difficultyLevel");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");

router.post(
    "/admin/difficulty",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    difficultyController.create
);
router.get(
    "/admin/difficulty",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    difficultyController.index
);

router.delete(
    "/admin/difficulty/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   difficultyController.delete
);

router.post(
    "/admin/difficulty/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
    [
        check("name")
            .not()
            .isEmpty()
            .escape(),
    ],
    difficultyController.upsert
);

router.get(
    "/admin/difficulty/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   difficultyController.show
);

module.exports = router;