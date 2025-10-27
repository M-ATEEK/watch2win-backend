const fileUpload = require("express-fileupload");
var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");
var passport = require("passport");
var userPolicy = require("../policies/users.policy");
const { check } = require("express-validator");
const validate = require("../middleware/validate");
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

router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  userController.index
);
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  (req, res) =>
    res.send({
      message: "User fetched",
      data: {
        user: {
          companyName: req.user.companyName,
          createdAt: req.user.createdAt,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          mobileNumber: req.user.mobileNumber,
          position: req.user.position,
          roles: req.user.roles
        }
      }
    })
);
// router.put(
//   "/user",
//   passport.authenticate("jwt", { session: false }),
//   userPolicy.isAllowed,
//   [
//     check("firstName")
//       .not()
//       .isEmpty(),
//     check("lastName")
//       .not()
//       .isEmpty(),
//     check("mobileNumber")
//       .not()
//       .isEmpty(),
//     check("companyName")
//       .not()
//       .isEmpty(),
//     check("position")
//       .not()
//       .isEmpty()
//   ],
//   validate,
//   userController.updateCurrent
// );
router.post("/authenticate", userController.authenticate);
router.post("/signup", upload.single('image'), userController.signup);
router.post("/forgetpassword", userController.forgetpassword);
router.post("/resetpassword", userController.resetpassword);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  userController.me
);
// router.post("/subscribe", userController.subscribe); // Function removed in cleanup
router.put(
  "/users/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  }),
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  userController.update
);

router.put(
  "/update-users/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  }),
  passport.authenticate("jwt", { session: false }),
  userPolicy.isAllowed,
  userController.updateUser
);

module.exports = router;
