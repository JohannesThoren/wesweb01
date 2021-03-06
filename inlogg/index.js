/*
 *   Copyright (c) 2020 Johannes Thorén
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

const exp = require("express");
const app = exp();
const bp = require("body-parser");
const md5 = require("md5");

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(exp.static("resources"));

// the user class that contains a name and password
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

// an array with all the users
// used to check if a user exists
const users = [];

app.get("/", (req, res) => {
  for (let i in users) {
    if (req.query.user == users[i].username) {
      res.render("home", { user: req.query.user });
      return;
    }
  }
  res.render("home", { user: null });
});

app.get("/signOut", (req, res) => {
  res.redirect("/");
});

app.get("/signUp", (req, res) => {
  res.render("sign-up");
});

app.post("/signUp", (req, res) => {
  //  checks if something there is something in the text input
  //  checks if pass1 and pass2 is matching
  if (
    md5(req.body.pass1) == md5(req.body.pass2) &&
    req.body.uname &&
    req.body.pass1 &&
    req.body.pass2
  ) {
    //checks if user exsists, if so redirect back to sign up
    for (user in users) {
      if (req.body.uname == users[user].username) {
        res.redirect("/SignUp");
      }
    }

    //create a new user and redirect to the sing in page
    let newUser = new User(req.body.uname, md5(req.body.pass1));
    users.push(newUser);
    res.redirect("/signIn");
  } else {
    res.redirect("/SignUp");
  }
});

app.get("/signIn", (req, res) => {
  res.render("sign-in");
});

app.post("/signIn", (req, res) => {
  for (let index in users) {
    // checks if username and password matches any username and password
    // in the users array.
    if (
      req.body.uname == users[index].username &&
      md5(req.body.pass) == users[index].password
    ) {
      res.redirect(
        `/?user=${users[index].username}&pass=${users[index].password}`
      );
      return;
    }
  }
  res.redirect("/signIn");
});

// the server listener
app.listen(8000, (err) => {
  if (err) console.log(err);
});
