var UserRouter = require("./routes/user");
var languageRouter = require("./routes/admin/language");
var sentenceRouter = require("./routes/admin/sentence");
var usersRouter=require("./routes/admin/users");
var categoriesRouter=require("./routes/admin/categories");
var athleteRouter=require("./routes/admin/athlete");

module.exports = function(app) {
  app.use('/api/v1', [
    UserRouter,
    languageRouter,
    sentenceRouter,
    usersRouter,
    categoriesRouter,
    athleteRouter
  ]);
};
