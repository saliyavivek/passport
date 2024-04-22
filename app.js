if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const User = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("flash-express");
const { checkIsLoggedIn, checkIsAlreadyLoggedIn } = require("./middleware");

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", checkIsLoggedIn, (req, res) => {
  res.render("index.ejs");
});

app.get("/register", checkIsAlreadyLoggedIn, (req, res) => {
  res.render("register.ejs");
});

app.get("/login", checkIsAlreadyLoggedIn, (req, res) => {
  res.render("login.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({
      email,
      username,
    });
    const regUser = await User.register(newUser, password);
    res.redirect("/login");
  } catch (error) {
    res.send(error.message);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

app.get("/logout", (req, res) => {
  req.logOut(() => {});
  res.redirect("/login");
});

app.listen(8080, () => {
  console.log("listening to port 8080");
});
