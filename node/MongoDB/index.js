const exp = require("express");
const app = exp();
const bp = require("body-parser");
const moon = require("mongoose");
const mo = require("method-override"); 


app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(exp.static("resources"));
app.use(mo("_method"));

moon.connect("mongodb://localhost:27017/Users", { useNewUrlParser: true, useUnifiedTopology: true })

const UsrSchema = new moon.Schema({
    usr: String,
    pass: String,
    fNamn: String,
    eNamn: String,
    age: Number,
    school: Boolean
});

let User = moon.model("User", UsrSchema);

app.get("/", (req, res) => {
    res.redirect("/index")
});

app.get("/index", (req, res) => {
    User.find({}, (err, data)=> {
        if(err) {
            res.send("404 - site not found")

        } else {
            console.log(data)
            let dat = data;
            res.render("index", {data: dat})
        }
    })
});

app.post("/", (req, res) => {
    console.log(req.body);

    let usr = req.body.usr;
    let pass = req.body.pass;
    let fNamn = req.body.fNamn;
    let eNamn = req.body.eNamn;
    let age = req.body.age;
    let inSchool = req.body.inS;

    User.create({
        usr: usr,
        pass: pass,
        fNamn: fNamn,
        eNamn: eNamn,
        age: age,
        school: inSchool
    });

    res.redirect("/");
});

app.listen(8000, function (err) {
    if (err) {
        console.log(err);
        console.log("någonting blev fel");
    } else {
        console.log("Connected");
    }
})