const express = require("express");
const books = require("./booksdb.js");
let users = require("./auth_user.js").users;

const public_user = express.Router();

public_user.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username: username, password: password });
  return res.status(201).json({ message: "User registered successfully" });
});

public_user.get("/", (req, res) => {
  res.send(JSON.stringify(books));
});

public_user.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_user.get("/author/:author", function (req, res) {
  const author_req = req.params.author;
  const matchBook = Object.values(books).filter(
    (book) => book.author === author_req
  );

  if (matchBook.length > 0) {
    res.status(200).json({ booksByAuthor: matchBook });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_user.get("/title/:title", (req, res) => {
  const title_req = req.params.title;
  const matchBook = Object.values(books).filter(
    (book) => book.title === title_req
  );
  if (matchBook.length > 0) {
    res.status(200).json({ booksByTitle: matchBook });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_user.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;
    if (Object.keys(reviews)) {
      res.json({ reviewsByUsers: reviews });
    } else {
      return res.status(404).json({ message: "No reviews for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports = public_user;
