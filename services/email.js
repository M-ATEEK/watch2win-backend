const nodeMailer = require("nodemailer");
const config = require("../config");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const path = require("path");
const S = require("string");
const CSSInliner = require("css-inliner");
const { exec } = require("child_process");

let transporter = nodeMailer.createTransport(config.mailCredentials);

const handlebars = require("handlebars");
const mainLayout = fs.readFileSync(
  path.join(__dirname, "../", "email-views", "layouts", "main.handlebars"),
  "utf8"
);

const inliner = new CSSInliner({
  directory: path.join(__dirname, "../", "public", "stylesheets")
});

// transporter.use(
//   "compile",
//   hbs({
//     viewEngine: {
//       handlebars: require("handlebars"),
//       extName: ".handlebars",
//       partialsDir: "./email-views/partials",
//       layoutsDir: "./email-views/layouts",
//       defaultLayout: "main"
//     },
//     viewPath: "./email-views"
//   })
// );

module.exports = {
  sendEmail: async (
    from,
    to,
    subject,
    templateName,
    context,
    showLayout = true
  ) => {
    const unCompiledView = fs.readFileSync(
      path.join(__dirname, "../", "email-views", templateName + ".handlebars"),
      "utf8"
    );
    let unCompiledHTML;

    if (showLayout) {
      unCompiledHTML = S(mainLayout).template(
        { body: unCompiledView },
        "{{{",
        "}}}"
      ).s;
    } else {
      unCompiledHTML = unCompiledView;
    }

    const compiledHTML = handlebars.compile(unCompiledHTML)({
      ...context,
      url: config.API_URL,
      appUrl: config.appURL,
      currentDate: new Date().getFullYear()
    });
    inliner.inlineCSSAsync(compiledHTML).then(function(result) {
      try {
        transporter.sendMail({
          from: from,
          to: to + "",
          subject: subject,
          html: result
        });
        return true;
      } catch (err) {
        console.log("Error send email address", err);
        return false;
      }
    });
  }
};
