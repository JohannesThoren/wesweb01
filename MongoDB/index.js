/*
 *   Copyright (c) 2021 Johannes Thorén
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
const moon = require("mongoose");
const mo = require("method-override");


app.set("view engine", "ejs");
app.use(exp.urlencoded({ extended: true }));
app.use(exp.static("resources"));
app.use(mo("_method"));

moon.connect("mongodb://localhost:27017/Users", { useNewUrlParser: true, useUnifiedTopology: true })

const UsrSchema = new moon.Schema({
    usr: String,
    pass: String,
    fNamn: String,
    eNamn: String,
    age: Number,
    inS: Boolean,
})


let User = moon.model("User", UsrSchema);


// User.create({
//     usr: "Johannes",
//     pass: "12314",
//     fNamn: "Johannes",
//     eNamn: "Thorén",
//     age: 17,
//     inS: true,
// })


app.get("/", (req, res) => {
    res.redirect("/index")
});

app.get("/index", (req, res) => {
    User.find({}, (err, data) => {
        if (err) {
            res.send("404 - site not found")

        } else {
            res.render("index", { data: data })
        }
    })
});

// new route

app.get("/index/new", (req, res) => {
    res.render("new")
})

app.post("/index", (req, res) => {
    console.log(req.body);

    let usr = req.body.usr;
    let pass = req.body.pass;
    let fNamn = req.body.fNamn;
    let eNamn = req.body.eNamn;
    let age = req.body.age;
    let inS = req.body.inS;

    User.create({
        usr: usr,
        pass: pass,
        fNamn: fNamn,
        eNamn: eNamn,
        age: age,
        inS: inS
    });

    res.redirect("/");
});

// show route 

app.get("/index/:id", (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            res.send("Profile not found!")
        } else {
            res.render("show", { data: data })
        }
    })
})

// edit route

app.get("/index/:id/edit", (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            res.send("Profile not found!")
        } else {
            res.render("edit", { data: data })
        }
    })
})

app.put("/index/:id", async (req, res) => {

    console.log("state : " + req.body.inS)

    await User.findByIdAndUpdate(req.params.id, {
        usr: req.body.usr,
        pass: req.body.pass,
        fNamn: req.body.fNamn,
        eNamn: req.body.eNamn,
        age: req.body.age,
        inS: req.body.inS,
    })

    res.redirect("/index")
})

// delete route
app.get("/index/:id/delete", (req, res) => {
    res.render("delete", { id: req.params.id })
})

app.delete("/index/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, (err)=> {
        if (err) {
            console.log(err)
            res.send("something went wrong!")
        } else {
            res.redirect("/")
        }
    })
})

app.listen(8000, function (err) {
    if (err) {
        console.log(err);
        console.log("någonting blev fel");
    } else {
        console.log("Connected");
    }
})