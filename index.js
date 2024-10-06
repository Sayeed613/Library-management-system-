const express = require("express");
const connection = require("./congfig/db.js");
const userRouter = require("./routes/user.route.js");
const authorRouter = require("./routes/author.route.js");
const bookRouter = require("./routes/books.route.js");
const borrowingRouter = require("./routes/borrowingroute.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/user", userRouter);
app.use("/author", authorRouter);
app.use("/book", bookRouter);
app.use('/borrowing', borrowingRouter);



app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Connected to the database : ${port}`);
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
  }
});
