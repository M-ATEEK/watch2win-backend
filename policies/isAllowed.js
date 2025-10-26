module.exports = function(acl) {
  return function(req, res, next) {
    var roles = req.user && req.user.roles ? req.user.roles : req.user.role;
    acl.areAnyRolesAllowed(
      roles,
      req.route.path,
      req.method.toLowerCase(),
      function(err, isAllowed) {
        if (err) {
          return res.status(500).send("Unexpected authorization error");
        } else {
          if (isAllowed) {
            return next();
          } else {
            return res.status(401).send({
              message: "User is not authorized"
            });
          }
        }
      }
    );
  };
};
