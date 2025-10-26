const router = require("express").Router();
const validate = require("../middleware/validate");
const { check } = require("express-validator");
const rimraf = require("rimraf");
const fs = require("fs");
const path = require("path");

router.get(
  "/:id",
  [
    check("id")
      .not()
      .isEmpty()
      .escape()
  ],
  validate,
  async (req, res) => {
    let { id } = req.params;
    if (id) {
      id = id.replace(".pdf", "");
    }
    const reportPath = path.join(
      __dirname,
      "../",
      "pdf-report",
      "temp",
      id,
      "report.pdf"
    );

    if (!fs.existsSync(reportPath)) {
      return res.status(404).send("No PDF found");
    }

    const pdf = fs.readFileSync(reportPath);

    rimraf(path.join(__dirname, "../", "pdf-report", "temp", id), err => {
      if (err) {
        console.log("Error deleting temp report dir", err);
      } else {
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdf);
      }
    });
  }
);

module.exports = router;
