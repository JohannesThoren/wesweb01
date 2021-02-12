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
    author: String,
    authorId: String,
    title: String,
    post: String,
    date: Date,
    tag: String,
})

let User = moon.model("User", userSchema);
let Post = moon.model("Post", postSchema);

// Post.create({
//     author: 'krabban',
//     authorId: '602245466e805a11370dfc7a',
//     post: 'hejsan!',
//     date: Date.now(),
//     tag: "hello",
//     title: "hejsan"
// })

// User.create({
//     username: 'John',
//     password: md5('12345678'),
//     firstName: 'John',
//     sureName: 'Doe',
//     email: 'john.doe@bulletin.net',
//     age: 1,
//     sessionId: null,
// })

function validateCookie(req, res, next) {
    const { cookies } = req

    if ('sessionId' in cookies && 'userId' in cookies) {
        User.findById(cookies.userId, (err, user) => {
            if (user) {
                if (cookies.sessionId == user.sessionId) {
                    next()
                }
                else {
                    res.status(403).redirect("/index/signIn")
                }
            }
            else {
                res.status(403).redirect("/index/signIn")
            }
        })
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
    const { cookies } = req

    let tag = req.query.tag
    console.log(tag)

    if (tag == "" || tag == undefined) {
        Post.find({}, (err, posts) => {
            User.findById(cookies.userId, (err, user) => {
                res.render('home', { posts: posts, user: user })
            })
        })
    }

    else {
        Post.find({ tag: tag }, (err, posts) => {
            User.findById(cookies.userId, (err, user) => {
                res.render('home', { posts: posts, user: user })
            })
        })
    }
})

app.post('/index', (req, res) => {
    let tag = req.body.tag

    res.redirect(`/index?tag=${tag}`)
})

app.get('/index/signUp', (req, res) => {
    res.render('signup')
})

app.post('/index/signUp', (req, res) => {

    let username = req.body.username
    let password = req.body.password
    let re_password = req.body.re_password
    let name = req.body.name
    let surname = req.body.surname
    let email = req.body.email
    let age = req.body.age

    if (username != '' && password.length >= 8 && password == re_password) {
        User.create({
            username: username,
            password: md5(password),
            firstName: name,
            sureName: surname,
            email: email,
            age: age,
            sessionId: null,
        })
    }
    else {

        // TODO fix this shit lmao
        if (password.length < 8) {

        }

        if (password != re_password) {

        }

        if (username == '') {

        }
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

    User.findOne({ username: username }, async (err, currentUser) => {
        if (currentUser) {
            if (err) {
                res.send(err)
            }

            // check password and username if it is correct
            if (password == currentUser.password && username == currentUser.username) {

                // set experation date for the new cookie
                // TODO Check if this works
                let date = new Date
                let expDate = new Date(date.getMilliseconds() + 604800000)

                let sessionId = md5(Math.random(Date.prototype.getMilliseconds))
                // create a new auth cookie


                res.cookie('sessionId', sessionId, { maxAge: expDate })
                res.cookie('userId', currentUser._id, { maxAge: expDate })

                // update the session id

                await User.findByIdAndUpdate(currentUser._id, { sessionId: sessionId })
            }
            // TODO fix!!! 
            // display an error that the username or password is wrong
            else {
                res.redirect('/index')
            }
        }
        else {
            res.redirect('/index')
        }
    });


})

app.get('/index/signOut', (req, res) => {
    const { cookies } = req
    User.findById(cookies.userId, async (err, user) => {
        await User.findByIdAndUpdate(user._id, { sessionId: null })
    })

    res.redirect('/')
})



app.get('/index/:id/edit', validateCookie, (req, res) => {

})

app.put('/index/:id/edit', (req, res) => {

})

// delete user
app.get('/index/:id/delete', validateCookie, (req, res) => {

})

app.get('/index/:id', (req, res) => {
    const { cookies } = req

    User.findById(req.params.id, (err, profile) => {
        User.findById(cookies.userId, (err, user) => {
            Post.find({ authorId: profile._id }, (err, posts) => {
                res.render('profile', { profile: profile, user: user, posts: posts })
            })
        })
    })
})
// new post
app.get('/index/:id/posts/new', validateCookie, (req, res) => {
    res.render('post_new')
})

app.post('/index/:id/posts/new', validateCookie, (req, res) => {
    const { cookies } = req

    let text = req.body.text
    let title = req.body.title
    let tag = req.body.tag
    let userId = cookies.userId


    User.findById(userId, (err, user) => {
        Post.create({
            author: user.username,
            authorId: user._id,
            post: text,
            date: Date.now(),
            tag: tag,
            title: title
        })
    })

    res.redirect('/')


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