const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"hussain","password":"pass123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is 
return username.length >= 6 && /^[a-zA-Z0-9_]+$/.test(username);

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.find(user=>user.username===username && user.password===password)
//attempt using array method to loop through users and return validated user

}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if(!isValid(username)){
    return res.status(400).json({
      error: "Invalid Username Format"
    })

  }


  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
            accessToken,username
        }

    return res.status(200).json({message:"login Successfully"})
  } 
  return res.status(401).json({error: "Authentication Failed"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { token } = req.headers;

  // Verify the JWT token to check if the user is authenticated.
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // If the token is valid, you can proceed to add a book review.
    // You can access the user information from the decoded token, e.g., decoded.username.
    // Write code to add a book review here.

    return res.status(200).json({ message: "Review added successfully" });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
