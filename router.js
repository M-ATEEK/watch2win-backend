var UserRouter = require("./routes/user");
var languageRouter = require("./routes/admin/language");
var sentenceRouter = require("./routes/admin/sentence");
var usersRouter=require("./routes/admin/users");
var categoriesRouter=require("./routes/admin/categories");
var athleteRouter=require("./routes/admin/athlete");
var difficultyRouter=require("./routes/admin/difficulty");
var speedRouter=require("./routes/admin/speed");
var subscriptionRouter=require("./routes/admin/subscription");
var drillsRouter=require("./routes/admin/drills");
var activityRouter=require("./routes/admin/activity");

module.exports = function(app) {
  app.use('/api/v1', [
    UserRouter,
    languageRouter,
    sentenceRouter,
    usersRouter,
    categoriesRouter,
    athleteRouter,
    difficultyRouter,
    speedRouter,
    subscriptionRouter,
    drillsRouter,
    activityRouter
  ]);
};
