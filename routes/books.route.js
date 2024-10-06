const express = require("express");
const BookModel = require("../models/book.model.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const isAdmin = require("../middlewares/checkAdminMiddleware.js");

const bookRouter = express.Router();

bookRouter.post("/create", authMiddleware, isAdmin, async (req, res) => {
  try {
    const {
      title,
      ISBN,
      summary,
      publicationDate,
      genres,
      copiesAvailable,
      author,
    } = req.body;
    const newBook = new BookModel({
      title,
      ISBN,
      summary,
      publicationDate,
      genres,
      copiesAvailable,
      author,
    });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
});

bookRouter.get("/", async (req, res) => {
  try {
    const books = await BookModel.find().populate("author");
    res.status(200).json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

bookRouter.get("/book/:id", async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id).populate("author");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving book", error: error.message });
  }
});

bookRouter.patch("/update/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const updatedBook = await BookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });
    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
});

bookRouter.delete("/delete/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const deletedBook = await BookModel.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
});

module.exports = bookRouter;
