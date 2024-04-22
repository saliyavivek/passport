const express = require("express");
const app = express();
require("./config/auth");
const passport = require("passport");
const session = require("express-session");

function checkIsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function checkIsAlreadyLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/auth/protected");
  }
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", checkIsAlreadyLoggedIn, (req, res) => {
  res.render("index.ejs");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/protected", checkIsLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.render("protected.ejs", { name });
});

app.get("/auth/google/failure", checkIsLoggedIn, (req, res) => {
  res.send("something went wrong");
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.listen(8080, () => {
  console.log("listening to port 8080");
});
