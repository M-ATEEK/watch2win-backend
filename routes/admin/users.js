var express = require("express");
var router = express.Router();
var usersController = require("../../controllers/admin/users");
var docusignController = require("../../controllers/admin/docusign");

var passport = require("passport");
const { check } = require("express-validator");
var userPolicy = require("../../policies/users.policy");
var config = require("../../config");
const validate = require("../../middleware/validate");
const fileUpload = require("express-fileupload");
const formidable = require('express-formidable');
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
    "/admin/docusignAccessToken",
    passport.authenticate("jwt", { session: false }),
    userPolicy.isAllowed,
    docusignController.saveAccessToken
);

router.post(
    "/admin/share_document/:job_id",
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/"
    }),
    passport.authenticate("jwt", { session: false }),
    userPolicy.isAllowed,
    docusignController.shareDocument
);
router.get(
  "/admin/secrets",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,

);
router.post(
  "/admin/download_pdf_report",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  docusignController.downloadDocument
);

router.get(
  "/admin/users",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  usersController.index
);

router.get(
  "/admin/searchUsers",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  usersController.searchAdminUsers
);

router.get(
  "/admin/users/search",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  [
    check("term")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
  ],
  validate,
  usersController.search
);

router.post(
  "/admin/users",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  usersController.create
);

router.put(
  "/admin/users/:id",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  usersController.update
);

router.get(
  "/admin/users/:id",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  usersController.show
);

router.delete(
  "/admin/users/:id",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  usersController.delete
);

// Additional simplified routes from commit d72cad37
router.get(
    "/admin/users-basic",
    passport.authenticate("jwt", { session: false }),
    //userPolicy.isAllowed,
    usersController.indexBasic
);

router.delete(
    "/admin/users-basic/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
    usersController.deleteBasic
);

router.post(
    "/admin/users-basic/:id",
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

router.get(
    "/admin/users-basic/:id",
    passport.authenticate("jwt", { session: false }),
   // languagePolicy.isAllowed,
    usersController.showBasic
);

router.get(
  "/admin/validate-token",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  usersController.validateToken
);

router.post(
  "/admin/authenticate",
  [
    check("email")
      .not()
      .isEmpty()
      .isEmail()
      .escape(),
    check("password")
      .not()
      .isEmpty()
      .escape()
  ],
  usersController.authenticate
);

router.post(
  "/admin/create",
  fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }),
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
    check("role")
      .not()
      .isEmpty()
      .isIn(config.roles.adminRoles)
      .escape()
  ],
  usersController.createAdmin
);

// New endpoints from athlete-drills commits
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
router.post(
    "/googlelogin",
    usersController.googlelogin
)
router.post(
    "/facebooklogin",
    usersController.facebooklogin
)

module.exports = router;
