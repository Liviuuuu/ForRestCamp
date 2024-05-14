const express = require("express");
const router = express.Router();
const passport = require("passport");

const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

const { storeReturnTo } = require("../middleware");

router.route("/register").get(users.renderRegister).post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
    users.login
  );

router.get("/logout", users.logout);

router.get("/mysettings", (req, res) => {
  // console.log(currentUser);
  res.render("users/account/mysettings");
});

router.get("/mytrips", (req, res) => {
  res.render("users/account/mytrips");
});

router.get("/myreviews", catchAsync(users.renderMyReviews));

router.get("/mywishlist", (req, res) => {
  res.render("users/account/mywishlist");
});

//Admin
router.get("/admin", (req, res) => {
  res.render("users/admin/index");
});

module.exports = router;
