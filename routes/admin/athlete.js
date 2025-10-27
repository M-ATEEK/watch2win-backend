var express = require("express");
var router = express.Router();
var athleteController = require("../../controllers/admin/athlete");
var passport = require("passport");
//var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/img/')
  },
  filename: function(req, file, cb) {
   cb(null, new Date().toISOString() + file.originalname);
  }
})
const upload = multer({storage: storage})

router.post(
    "/admin/athlete",
    upload.single("image"),
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
    upload.single('image'),
    athleteController.upsert
);

router.get(
    "/admin/athlete/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    athleteController.show
);

module.exports = router;

