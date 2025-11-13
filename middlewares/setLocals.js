// middleware/setLocals.js
export default function setLocals(req, res, next) {
  res.locals.currentPath = req.path;
  next();
}
