const exp = require("express");
const app = exp();
const bp = require("body-parser")

app.set("view engine", "ejs");
app.use(bp.urlencoded({extended: true}));
app.use(exp.static("resources"));


app.get("/", (req, res) =>  {
    res.render("home");
});

app.listen(8000, (err) => {
    if(err) console.log(err);
})