/**
 * Strip $ and . from user input in body/params to reduce NoSQL injection risk.
 * (express-mongo-sanitize is incompatible with Express 5.)
 */
function stripKeys(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripKeys);

  return Object.keys(obj).reduce((acc, key) => {
    const safeKey = key.replace(/^\$|\./g, "");
    acc[safeKey] = stripKeys(obj[key]);
    return acc;
  }, {});
}

function sanitizeInput(req, _res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = stripKeys(req.body);
  }
  if (req.params && typeof req.params === "object") {
    req.params = stripKeys(req.params);
  }
  next();
}

module.exports = sanitizeInput;
