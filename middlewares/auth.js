const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
  }
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // we throw an error if something goes wrong
    throw new UnauthorizedError("Authorization required");
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};

module.exports = { auth };
