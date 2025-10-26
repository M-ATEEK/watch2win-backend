var UserRouter = require("./routes/user");
var languageRouter = require("./routes/admin/language");
var sentenceRouter = require("./routes/admin/sentence");

module.exports = function(app) {
  app.use('/api/v1', [
    UserRouter,
    languageRouter,
    sentenceRouter
  ]);
};
