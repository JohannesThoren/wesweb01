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
    surName: String,
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
//     surName: 'Doe',
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

    User.findOne({ username: username }, (err, user) => {
        if (user) {

            res.status(403).send("A user with that name already exists already exists!")
        }
        else {

            if (username != '' && password.length >= 8 && password == re_password) {
                User.create({
                    username: username,
                    password: md5(password),
                    firstName: name,
                    surName: surname,
                    email: email,
                    age: age,
                    sessionId: null,
                })

                res.redirect('/index/signIn')
            }
            else {

                // TODO fix this shit lmao
                // this is just a place holder!!!!
                if (username == '') {
                    res.send("pleas enter a username!")
                }
                else if (password.length < 8) {
                    res.send("The password has to be 8 characters long!")
                }

                else if (password != re_password) {
                    res.send("Password don't match")
                }
                else {
                    res.redirect('/index')
                }
            }
        }
    });
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

                res.redirect('/index')
            }

            // TODO fix!!! 
            // display an error that the username or password is wrong
            else {
                res.send("username or password do not match any user!")
            }
        }
        else {
            res.send("username or password do not match any user!")
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
    User.findById(req.params.id, (err, user) => {
        res.render('profile_edit', { user: user })
    })
})

app.put('/index/:id', async (req, res) => {

    if (req.body.password == req.body.re_password) {

        console.log(req.body)

        await User.findByIdAndUpdate(req.params.id, {
            username: req.body.username,
            firstName: req.body.name,
            surName: req.body.surname,
            email: req.body.email,
            age: req.body.age
        })

        User.findById(req.params.id, (err, user) => {
            Post.find({ authorId: user._id }, async (err, posts) => {
                for (index in posts) {
                    await Post.findByIdAndUpdate(posts[index]._id, {
                        author: req.body.username
                    })
                }
            })
        })

        res.redirect('/')
    }
    else {
        res.send("password do not match!")
    }
})
app.get('/index/:id/delete', validateCookie, (req, res) => {
    res.render('profile_delete', { id: req.params.id })
})
// delete user
app.delete('/index/:id', validateCookie, (req, res) => {
    User.findById(req.params.id, async (err, user) => {
        Post.find({ authorId: user._id }, async (err, posts) => {
            for (index in posts) {
                await Post.findByIdAndDelete(posts[index]._id, (err) => { if (err) console.log(err) })
            }
        })

        await User.findByIdAndDelete(req.params.id, (err) => {
            res.redirect('/index')
        })
    })
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

    tag = tag.replace('#', '')

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
    let authorId = req.params.id
    let postId = req.params.post_id
    Post.findById(postId, (err, post) => {
        console.log(post)
        res.render('post_edit', { post: post, authorId: authorId })
    })
})

app.put('/index/:id/posts/:post_id/', async (req, res) => {
    let post_text = req.body.text
    let post_title = req.body.title
    let post_tag = req.body.tag

    await Post.findByIdAndUpdate(req.params.post_id, {
        title: post_title,
        post: post_text,
        tag: post_tag,
        date: Date.now()
    })

    res.redirect('/index')
})

// delete  post
app.get('/index/:id/posts/:post_id/delete', validateCookie, (req, res) => {
    res.render('post_delete', { post_id: req.params.post_id, authorId: req.params.id })
})

app.delete('/index/:id/posts/:post_id', (req, res) => {
    Post.findByIdAndDelete(req.params.post_id, (err) => {
        res.redirect('/index')
    })
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