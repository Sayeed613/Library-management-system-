const express = require("express");
const BookModel = require("../models/book.model");
const BorrowingTransactionModel = require("../models/borrowing.model");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/checkAdminMiddleware");

const borrowingRouter = express.Router();

borrowingRouter.post("/", authMiddleware, async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user._id;
  try {
    const book = await BookModel.findById(bookId);
    if (book.copiesAvailable > 0) {
      book.copiesAvailable -= 1;
      await book.save();

      const newBorrowingTransaction = new BorrowingTransactionModel({
        book: bookId,
        member: userId,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks due date
      });
      await newBorrowingTransaction.save();

      res
        .status(201)
        .json({
          message: "Book borrowed successfully",
          borrowingTransaction: newBorrowingTransaction,
        });
    } else {
      res.status(400).json({ message: "No copies available for borrowing" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error borrowing book", error: error.message });
  }
});

borrowingRouter.post(
  "/return/:transactionId",
  authMiddleware,
  async (req, res) => {
    try {
      const transaction = await BorrowingTransactionModel.findById(
        req.params.transactionId
      ).populate("book");
      if (!transaction || transaction.status === "Returned") {
        return res
          .status(400)
          .json({ message: "Invalid transaction or book already returned" });
      }
      transaction.returnDate = new Date();
      transaction.status = "Returned";
      await transaction.save();

      const book = transaction.book;
      book.copiesAvailable += 1;
      await book.save();

      res
        .status(200)
        .json({ message: "Book returned successfully", transaction });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error returning book", error: error.message });
    }
  }
);

module.exports = borrowingRouter;
