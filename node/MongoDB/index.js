const exp = require("express");
const app = exp();
const bp = require("body-parser");
const moon = require("mongoose");

app.set("view engine", "ejs");
app.use(bp.urlencoded({extended: true}));
app.use(exp.static("resources"));

moon.connect("mongodb://localhost:27017/Users", {useNewUrlParser: true, useUnifiedTopology:true})

const UsrSchema = new moon.Schema({
    anvNamn: String,
    pass: String,
    fNamn: String,
    eNamn:String,
    age: Number,
    school: Boolean
});

let User = moon.model("User", UsrSchema);

/* User.create({
    anvNamn: "Niklas",
    pass: "happy",
    fNamn: "Niklas",
    eNamn: "Oscarsson",
    age: 34,
    school: false
}); */

app.listen(3000, function(err){
    if(err){
        console.log(err);
        console.log("någonting blev fel");
    }else{
        console.log("Connected");
    }
})