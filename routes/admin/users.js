var express = require("express");
var router = express.Router();
var usersController = require("../../controllers/admin/users");
var passport = require("passport");
var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const { check } = require("express-validator");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const upload = multer({ storage: storage })



router.get(
    "/admin/users",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    usersController.index
);

router.delete(
    "/admin/users/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    usersController.delete
);

router.post(
    "/admin/users/:id",

    passport.authenticate("jwt", { session: false }),

    // languagePolicy.isAllowed,
    [
        check("firstName")
            .not()
            .isEmpty()
            .escape(),
        check("lastName")
            .not()
            .isEmpty()
            .escape(),
        check("email")
            .not()
            .isEmpty()
            .escape(),
        check("password")
            .not()
            .isEmpty()
            .escape(),
    ],
    upload.single('image'),

    usersController.upsert
);
router.post(
    "/user/favoriteVideo",
    passport.authenticate("jwt", { session: false }),
    usersController.addToFvorite
),
 router.post(
        "/user/watchLater",
        passport.authenticate("jwt", { session: false }),
        usersController.addToWatchLater
    )
router.get(
    "/user/search",
    passport.authenticate("jwt", { session: false }),
    usersController.search
);
router.get(
    "/user/detail",
    passport.authenticate("jwt", { session: false }),
    usersController.me
);

router.get(
    "/admin/users/:id",
    passport.authenticate("jwt", { session: false }),
    // languagePolicy.isAllowed,
    usersController.show
);
router.post(
    "/googlelogin",
    usersController.googlelogin
)
router.post(
    "/facebooklogin",
    usersController.facebooklogin
)
router.get(
    "/checkoutNew",
    usersController.tokenGenerate
)
router.post(
    "/checkout", 
    passport.authenticate("jwt", { session: false }),
    usersController.transection

  );
  router.get(
      "/loginUser",
      passport.authenticate("jwt", { session: false }),
      usersController.loginUser
  )
  router.post(
    "/user/followUser", 
    passport.authenticate("jwt", { session: false }),
    usersController.followUser
  )
  router.get(
    "/admin/subscriberbymonth", 
    passport.authenticate("jwt", { session: false }),
    usersController.subscribeByMonth
  )
  router.get(
    "/admin/totalsubscriber", 
    passport.authenticate("jwt", { session: false }),
    usersController.subscribers
  )
module.exports = router;