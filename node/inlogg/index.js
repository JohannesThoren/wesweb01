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

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(exp.static("resources"));

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

var users = [new User("user1", "password1"), new User("user2", "password2")];

var currentUser = null;

app.get("/", (req, res) => {
  res.render("home", { user: currentUser });
});

app.get("/signIn", (req, res) => {
  res.render("sign-in");
});

app.get("/signOut", (req, res) => {
  console.log(currentUser.username+" signed out")
  currentUser = null;
  res.redirect("/");
});

app.post("/signIn", (req, res) => {
  var username = req.body.uname;
  var password = req.body.pass;

  for (let index in users) {
    if (
      username === users[index].username &&
      password === users[index].password
    ) {
      console.log(username + " signed in");
      currentUser = new User(username, password);
      res.redirect("/");
    }
  }
});

app.listen(8000, (err) => {
  if (err) console.log(err);
});
