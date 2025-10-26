var express = require("express");
var router = express.Router();
var sentencesController = require("../../controllers/admin/sentences");
var passport = require("passport");
const { check } = require("express-validator");
var sentencesPolicy = require("../../policies/sentences.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");

router.get(
    "/admin/sentences",
    passport.authenticate("jwt", { session: false }),
    sentencesPolicy.isAllowed,
    sentencesController.index
);

router.get(
    "/admin/sentences/:id",
    passport.authenticate("jwt", { session: false }),
    sentencesPolicy.isAllowed,
    sentencesController.show
);


router.post(
    "/admin/sentences/:id",
    passport.authenticate("jwt", { session: false }),
    sentencesPolicy.isAllowed,
    sentencesController.upsert
);

router.delete(
    "/admin/sentences/:id",
    passport.authenticate("jwt", { session: false }),
    sentencesPolicy.isAllowed,
    sentencesController.delete
);


module.exports = router;
