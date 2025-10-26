var UserRouter = require("./routes/user");
var PropertyRouter = require("./routes/properties");
var priviligedUserRouter = require("./routes/admin/priviligedUser");
var profileRouter = require("./routes/admin/profile");
var usersRouter = require("./routes/admin/users");
var pricesRouter = require("./routes/admin/prices");
var subscribersRouter = require("./routes/admin/subscribers");
var contentsRouter = require("./routes/admin/contents");
var slidersRouter = require("./routes/admin/sliders");
var termsRouter = require("./routes/admin/terms");
var docusignRouter = require("./routes/admin/docusign");
var blogRouter = require("./routes/admin/blog");
var categoriesRouter = require("./routes/admin/categories");
var faqRouter = require("./routes/admin/faq");
var pressRouter = require("./routes/admin/press");
var jobsRouter = require("./routes/admin/jobs");
var adminPropertyRouter = require("./routes/admin/properties");
var activityRouter = require("./routes/admin/activities");
var invoicesRouter = require("./routes/admin/invoices");
var languageRouter = require("./routes/admin/language");
var sentenceRouter = require("./routes/admin/sentence");

module.exports = function(app) {
  app.use('/api/v1', [
    UserRouter,
    PropertyRouter,
    priviligedUserRouter,
    profileRouter,
    usersRouter,
    pricesRouter,
    subscribersRouter,
    contentsRouter,
    slidersRouter,
    termsRouter,
    blogRouter,
    categoriesRouter,
    faqRouter,
    pressRouter,
    jobsRouter,
    adminPropertyRouter,
    activityRouter,
    invoicesRouter,
    languageRouter,
    sentenceRouter,
    docusignRouter
  ]);
};
