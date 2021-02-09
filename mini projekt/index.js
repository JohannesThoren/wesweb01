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
const util = require('util');
const mo = require('method-override');
const md5 = require('md5')
const cookieParser = require('cookie-parser');
const Cookies = require('cookies');
const { nextTick } = require('process');
const { randomInt } = require('crypto');
const { json } = require('body-parser');


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
 *   session id
=======================
*/

const userSchema = new moon.Schema({
    username: String,
    password: String,
    firstName: String,
    sureName: String,
    email: String,
    age: Number,
    sessionId: String,
})


const postSchema = new moon.Schema({
    user: String,
    title: String,
    post: String,
    date: Date,
    tag: String,
})

let User = moon.model("User", userSchema);
let Post = moon.model("Post", postSchema);

// Post.create({
//     user: 'test4',
//     title: 'hej',
//     post: 'hejsan!',
//     date: Date.now(),
//     tag: "hello"
// })

// User.create({
//     username: 'test4',
//     password: md5('123'),
//     firstName: 'Test',
//     sureName: 'Testsson',
//     email: 'Test@Test.Test',
//     age: 1,
//     sessionId: null,
// })

function validateCookie(req, res, next) {
    const { cookies } = req
    // check if cookie is expierd and if the session id is ok

    let sessionIdCookie = 'sessionId' in cookies

    // checks if client has a cookie amd throws status 200
    // if not throws status 403
    if ('sessionId' in cookies && 'userId' in cookies) {
        if (User.find({ 'sessionId': 'sessionId' in cookies })) {
            next()
        }
    }
    else {
        res.status(403).redirect("/index/signIn")
    }
}


// just home............
app.get('/', validateCookie, (req, res) => {
    res.redirect("/index")
})

app.get('/index', validateCookie, (req, res) => {
    Post.find({}, (err, posts) => {
        User.findById(res.cookie.userId, (err, user) => {
            
            res.render('home', {posts:posts, user:user})
        })
    })
}) 

app.get('/index/signUp', (req, res) => {
    res.render('signup')
})

app.post('/index/signUp', (req, res) => {
    
    let username = req.body.username
    let password = req.body.password
    let re_password = req.body.re_password
    let name = req.body.name
    let surename = req.body.surename
    let email = req.body.email
    let age = req.body.age

    if (username != '' && password.length >= 8 && password == re_password) {
        User.create({
            username: username,
            password: md5(password),
            firstName: name,
            sureName: surename,
            email: email,
            age: age,
            sessionId: null,
        })
    }



    res.redirect('/index/signIn')
})

// sign in
app.get('/index/signIn', (req, res) => {
    res.render('signin')
})

app.post('/index/signIn', (req, res) => {
    let password = md5(req.body.password);
    let username = req.body.username;


    // find User with username then do stuff
    User.findOne({ username: username }, (err, currentUser) => {

        if (err) {
            res.send(err)
        }

        // check password and username if it is correct
        try {
            if (password == currentUser.password && username == currentUser.username) {

                // set experation date for the new cookie
                // TODO Check if this works
                let date = new Date
                let expDate = new Date(date.getMilliseconds() + 604800000)
                // create a new auth cookie
                res.cookie('sessionId', md5(Math.floor(Math.random(Date.now()))), { maxAge: expDate })
                console.log(currentUser._id)
                res.cookie('userId', currentUser._id, { maxAge: expDate })
            }
            else {
                console.log("ERROR! wrong password or username");
            }
        }
        catch (err) {
            console.log(err)
        }
        res.redirect('/index')
    });


})

// the user profile
// app.get('/index/:id', (req, res) => {
//     res.render('profile', { data: data })
// })

// edit user
app.get('/index/:id/edit', validateCookie, (req, res) => {

})

app.put('/index/:id/edit', (req, res) => {

})

// delete user
app.get('/index/:id/delete', validateCookie, (req, res) => {

})

app.delete('/index/:id', (req, res) => {

    User.findById(req.params.id, (err, data) => {
        console.log(id)

        res.render('profile', {profile: data})
    })


})
// new post
app.get('/index/:id/posts/new', validateCookie, (req, res) => {

})

app.post('/index/:id/posts/new', validateCookie, (req, res) => {

})

// edit post
app.get('/index/:id/posts/:post_id/edit', validateCookie, (req, res) => {

})

app.put('/index/:id/posts/:post_id/edit', (req, res) => {

})

// delete  post
app.get('/index/:id/posts/:post_id/delete', validateCookie, (req, res) => {

})

app.delete('/index/:id/posts/:post_id', (req, res) => {

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