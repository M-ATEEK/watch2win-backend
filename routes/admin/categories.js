var express = require("express");
var router = express.Router();
var categoriesController = require("../../controllers/admin/categories");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");

router.post(
    "/admin/categories",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    categoriesController.create
);
router.get(
    "/admin/categories",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    categoriesController.index
);

router.delete(
    "/admin/categories/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   categoriesController.delete
);

router.post(
    "/admin/categories/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
    [
        check("name")
            .not()
            .isEmpty()
            .escape(),
    ],
    categoriesController.upsert
);

router.get(
    "/admin/categories/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
   categoriesController.show
);

module.exports = router;
