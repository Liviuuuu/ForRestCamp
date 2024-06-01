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

router.get("/mysettings", catchAsync(users.renderMySettings));
router.put("/mysettings/update", catchAsync(users.updateMySettings));

router.get("/mytrips", users.renderMyTrips);

router.get("/myreviews", catchAsync(users.renderMyReviews));

router.get("/mywishlist", users.renderMyWishlist);

//Admin
router.get("/admin", (req, res) => {
  res.render("users/admin/index");
});

module.exports = router;
