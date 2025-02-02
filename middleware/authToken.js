import JWT from "jsonwebtoken";

export const authToken = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      return res.status(401).json({
        status: "failure",
        statusCode: 401,
        message: "Authentication failed: Token not found",
      });
    }

    const verifiedToken = JWT.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedToken._id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "failure",
        statusCode: 401,
        message: "Authentication failed: Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "failure",
        statusCode: 401,
        message: "Authentication failed: " + error.message,
      });
    } else {
      console.log(error.message);
      return res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }
};
