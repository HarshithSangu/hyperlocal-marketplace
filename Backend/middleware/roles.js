module.exports = function allowRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Authentication required" });
    if (!allowed.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
