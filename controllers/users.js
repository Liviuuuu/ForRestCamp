const User = require("../models/user");
const Review = require("../models/review");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, fullName, password } = req.body;
    const user = new User({ email, username, fullName });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to ForRestCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};

module.exports.renderMySettings = async (req, res) => {
  // console.log(req.user);
  res.render("users/account/mysettings");
};

module.exports.updateMySettings = async (req, res) => {
  const { id } = req.user;
  const user = await User.findByIdAndUpdate(id, { ...req.body.user });
  user.save();

  req.flash("success", "Your settings were updated succcesfully!");
  res.redirect("/mysettings");
};

module.exports.renderMyTrips = (req, res) => {
  res.render("users/account/mytrips");
};

module.exports.renderMyReviews = async (req, res) => {
  const reviews = await Review.find({ author: req.user._id }).populate("campground", "title");
  res.render("users/account/myreviews", { reviews });
};

module.exports.deleteMyReview = async (req, res) => {
  const reviews = await Review.find({ author: req.user._id }).populate("campground", "title");
  res.render("users/account/myreviews", { reviews });
};

module.exports.renderMyWishlist = (req, res) => {
  res.render("users/account/mywishlist");
};
