/*
 *   Copyright (c) 2021 Johannes Thorén
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the 'Software'), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */


const exp = require('express');
const app = exp();
const moon = require('mongoose');
const mo = require('method-override');
const md5 = require('md5')
const cookieParser = require('cookie-parser');
const Cookies = require('cookies');
const { nextTick } = require('process');


app.set('view engine', 'ejs');
app.use(exp.urlencoded({ extended: true }));
app.use(exp.static('resources'));
app.use(mo('_method'));
app.use(cookieParser());


// connection to database
// one for users, one for the posts
moon.connect('mongodb://localhost:27017/SocialMedia', { useNewUrlParser: true, useUnifiedTopology: true })

/*
=======================
a profile will contain
 *   a password
 *   a user name
 *   an email
 *   real name
 *   age
=======================
*/

const userSchema = new moon.Schema({
    username: String,
    password: String,
    firstName: String,
    sureName: String,
    email: String,
    age: Number,
})


const postSchema = new moon.Schema({
    sender_id: String,
    post: String,
    date: Date,
})

let User = moon.model("User", userSchema);
let Post = moon.model("Post", postSchema);

User.create({
    username: 'test',
    password: '123',
    firstName: 'Test',
    sureName: 'Testsson',
    email: 'Test@Test.Test',
    age: 1,
})


// just home............
app.get('/', (req, res) => {
    res.redirect("/index")
})

app.get('/index', (req, res) => {
    res.render('home')
})

// new user
app.get('/index/new', (req, res) => {

})

function validateCookie(req, res, next) {
    const { cookies } = req
    if ('sessionId' in cookies) {

        next()
    }
    else {
        res.send("LOL!")
    }


}

// sign in
app.get('/index/signIn', validateCookie, (req, res) => {
    res.render('signin')
})

app.post('/index/signIn', (req, res) => {
    let password = md5(req.body.password)
    let username = req.body.username

    let currentUser = User.find({ 'username': username })

    if (password == currentPassword.password) {
        console.log(currentUser.password)

        let sessionId = res.cookie('sessionId', md5(Date.now))
    }

    else {
        console.log("fuck you!")
    }

    console.log(req.body)
    res.redirect('home')
})

// home... just signed in lol
app.get('/index/:id', (req, res) => {
    res.render('home')
})

// the user profile
app.get('/index/:id/profile', (req, res) => {

})

// edit user
app.get('/index/:id/edit', (req, res) => {

})

app.put('/index/:id/edit', (req, res) => {

})

// delete user
app.get('/index/:id/delete', (req, res) => {

})

app.delete('/index/:id', (req, res) => {

})

// edit post
app.get('/index/:id/post/:post_id/edit', (req, res) => {

})

app.put('/index/:id/post/:post_id/edit', (req, res) => {

})

// delete  post
app.get('/index/:id/post/:post_id/delete', (req, res) => {

})

app.delete('/index/:id/post/:post_id', (req, res) => {

})

// starting the server
app.listen(8000, (err) => {
    if (err) {
        console.log(err);
        console.log("någonting blev fel");
    } else {
        console.log("Connected");
    }
})