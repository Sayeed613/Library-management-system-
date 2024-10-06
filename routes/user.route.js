const express = require("express");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        res.status(404).json({
          message: "An error occurred while hashing the password",
        });
      } else {
        const user = new UserModel({
          name,
          email,
          password: hash,
          role,
        });
        await user.save();
        res.status(201).json({
          message: "User registered successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while registering the user",
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
          res.status(200).json({
            message: "User logged in successfully",
            token,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      });
    }
  } catch (Error) {
    res.status(500).json({ message: "User not found" });
  }
});

module.exports = userRouter;
