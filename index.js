const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


const app = express();

mongoose
  .connect("mongodb://localhost:27017/shiva")
  .then(() => console.log("Database is Connected"))
  .catch(() => console.log("Not Connected Database"));
app.use(cookieParser()); // ye middleware cookies console me read karne me help karega

usersSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  cpassword: String,
});

const User = mongoose.model("User", usersSchema);

app.use(express.urlencoded({ extended: true })); // iss middleware ko use karke hmm form ke data ko access kar payenge console me
app.use(express.static(path.join(__dirname, "public")));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const isAuthenticated = function (req, res, next) {
  const token = req.cookies.token;
  if (token) {
    res.redirect("/profile");
  } else {
    next();
  }
};

const isProfileAuth = function(req,res,next){
  const token = req.cookies.token;
  if (token) {
    next()
  } else {
   res.redirect("/login")
  }
}

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/register", isAuthenticated, function (req, res) {
  res.render("register");
});
app.get("/login", isAuthenticated, function (req, res) {
  res.render("login");
});
app.get("/profile", isProfileAuth,function (req, res) {
  res.render("profile")
});

app.post("/register", async function (req, res) {
  await User.create({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    cpassword: req.body.cpassword,
  });

  res.redirect("/login");

  //     res.redirect("/success")
  //    console.log("success")
});

app.post("/login", async function (req, res) {
  const client = { email: req.body.email, password: req.body.password };

  const data = await User.findOne(client);

  if (data) {
    res.cookie("token", "I am in");
    res.redirect("/profile");
  } else {
    res.redirect("/register");
  }
  // res.render("login")
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
