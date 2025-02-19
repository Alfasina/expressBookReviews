const express = require('express');
let books = require("./booksdb.js");
const { json } = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



const doesExist = (username, users) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  return usersWithSameName.length > 0;
};

//find books given requested data and param
function findBook(para, given) {
  console.log(given)
  for (const bookId in books) {
    if (books[bookId][para] === given) {
      return {
        isbn: bookId,
        ...books[bookId],
      };
    }
  }
  return null;
}

function findBookByISBN(isbn) {
  for (const bookId in books) {
    if (bookId == isbn) {
      return {
        isbn: bookId,
        ...books[isbn],
      };
    }
  }
  return null;
}


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({ books: books });;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn; // Replace with the ISBN you're looking for
const book = findBookByISBN(requestedISBN);

  if (book) {
    // If a book with the specified ISBN is found, respond with its details
    return res.status(200).json({ book: book });
  } else {
    // If no matching book is found, respond with a 404 (Not Found) status
    return res.status(404).json({ message: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {


  
  //Write your code here
  const requestedAuthor= req.params.author;

  const book= findBook('author',requestedAuthor)

  if (book){
    return res.status(200).json({books : book}) ;
  }
  return res.status(300).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle=req.params.title

  const book=findBook("title",requestedTitle)

  if (book){
    return res.status(200).json({book:book})
  }

  return res.status(300).json({message: "Book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  
  //Write your code here
  const bookIsbn=req.params.isbn

  const book=findBookByISBN(bookIsbn)

  if(book){
    return res.status(200).json({review:book.reviews})
  }

  return res.status(300).json({message: "Book not found"});
});

module.exports.general = public_users;
