const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return 0;
  }
  else {
    return 1;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
} 

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  // Find matching user
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  // Store token in session
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "User logged in successfully!", token: accessToken });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Ensure user is authenticated
  const username = req.session.authorization?.username;
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Validate review
  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required" });
  }

  // Add or update review
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Get logged-in username from session
  const username = req.session.authorization?.username;
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if user has a review to delete
  if (!book.reviews.hasOwnProperty(username)) {
    return res.status(404).json({ message: "Review by this user not found" });
  }

  // Delete user's review
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
