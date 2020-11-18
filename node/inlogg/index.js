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
const md5 = require("md5")

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(exp.static("resources"));

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

var users = [];

app.get("/", (req, res) => {
 
  for (var i in users.length) {
    console.log(users[i])
    if (users[i].username == req.query.User) {
      res.render("home", { user: req.query.user });
    }
  }

  res.render("home", {user:null});
});

app.get("/signOut", (req, res) => {
  res.redirect("/");
});

app.get("/signUp", (req, res) => {
  res.render("sign-up");
})

app.post("/signUp", (req, res) => {
  if (md5(req.body.pass1) == md5(req.body.pass2) && req.body.uname != "" && req.body.pass1 != "" && req.body.pass2 != "") {
    let newUser = new User(req.body.uname, md5(req.body.pass1))
    users.push(newUser);
    res.redirect("/signIn")
  }
  else {
    res.redirect("/SignUp")
  }
})

app.get("/signIn", (req, res) => {
  res.render("sign-in");
});

app.post("/signIn", (req, res) => {
  for (let index in users) {
    if (
      req.body.uname == users[index].username &&
      md5(req.body.pass) == users[index].password
    ) {
      console.log(req.body.uname + " signed in");
      currentUser = new User(req.body.uname, md5(req.body.pass));
      res.redirect(`/?user=${users[index].username}&pass=${users[index].password}`);
    }
  }
  res.redirect("/signIn")
});

app.listen(8000, (err) => {
  if (err) console.log(err);
});
