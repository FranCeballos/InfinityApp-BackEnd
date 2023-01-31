import jwt from "jsonwebtoken";

const PRIVATE_KEY = "asd456";

export const generateAuthToken = (name) => {
  const token = jwt.sign({ name: name }, PRIVATE_KEY, { expiresIn: "120s" });
  return token;
};

export const auth = (req, res, next) => {
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
    req.user = jwt.verify(token, PRIVATE_KEY);
  } catch (err) {
    return res.status(401).json({
      error: "invalid token",
      detail: "insuficient level access for requested resource",
    });
  }

  next();
};
