const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  console.log(req.headers);
  const token = req.headers.authorizaton.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      }
      if (decoded) {
        const userId = decoded.id;
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        req.user = user;
        next();
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;
