const jwt = require("jsonwebtoken");

function generateAuthToken(name) {
  const token = jwt.sign({ name: name }, process.env.PRIVATE_KEY, {
    expiresIn: "120s",
  });
  return token;
};

function auth(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"] || "";
  console.log("req.headers", req.headers);
  console.log("Authheader", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      error: "need authentication for accessing this resource",
      detail: "authentication tokken not found",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "need authentication for accessing this resource",
      detail: "invalid token format",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.PRIVATE_KEY);
  } catch (err) {
    return res.status(401).json({
      error: "invalid token",
      detail: "insuficient level access for requested resource",
    });
  }

  next();
};

module.exports = {
  generateAuthToken,
  auth,
};
