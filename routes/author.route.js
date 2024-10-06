const express = require("express");
const AuthorModel = require("../models/author.model.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const isAdmin = require("../middlewares/checkAdminMiddleware.js");

const authorRouter = express.Router();

authorRouter.post("/create", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, biography, dateOfBirth, nationality } = req.body;

    const newAuthor = new AuthorModel({
      name,
      biography,
      dateOfBirth,
      nationality,
    });
    await newAuthor.save();

    res
      .status(201)
      .json({ message: "Author created successfully", author: newAuthor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating author", error: error.message });
  }
});

authorRouter.get("/", async (req, res) => {
  try {
    const authors = await AuthorModel.find().populate("books");
    res.status(200).json(authors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving authors", error: error.message });
  }
});

authorRouter.get("/:id", async (req, res) => {
  try {
    const author = await AuthorModel.findById(req.params.id).populate("books");
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving author", error: error.message });
  }
});

authorRouter.patch("/update/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }
    res
      .status(200)
      .json({ message: "Author updated successfully", author: updatedAuthor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating author", error: error.message });
  }
});

authorRouter.delete(
  "/delete/:id",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const deletedAuthor = await AuthorModel.findByIdAndDelete(req.params.id);
      if (!deletedAuthor) {
        return res.status(404).json({ message: "Author not found" });
      }
      res.status(200).json({ message: "Author deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting author", error: error.message });
    }
  }
);

module.exports = authorRouter;
