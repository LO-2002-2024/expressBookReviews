const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
    // Collect the username and password from POST body
    username = req.body.username,
    password = req.body.password

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  let valid = isValid(username)

  // Register new user
  if (valid) {
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully!" });
  }
  else {
    return res.status(409).json({ message: "Username already exists. Please choose another one." });
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted friends data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  // Extract the author parameter from the request URL
  const author = req.params.author;
  let filtered_authors = Object.values(books).filter(books => books.author === author);

  if (filtered_authors.length === 0) {
    return res.status(404).send({ message: "Author not found" });
  }

  res.send(filtered_authors);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  const title = req.params.title;
  let filtered_titles = Object.values(books).filter(books => books.title === title);

  if (filtered_titles.length === 0) {
    return res.status(404).send({ message: "Author not found" });
  }

  res.send(filtered_titles);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    res.send(reviews)
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
