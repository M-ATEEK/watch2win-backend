const router = require("express").Router();
const ConfigController = require("../controllers/config");

router.get("/", ConfigController.get);

module.exports = router;
