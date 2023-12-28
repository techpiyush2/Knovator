const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRegister } = require("../utils/validation");

const register = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Username already exists" });
    }

    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });

    await newUser.save();
    res
      .status(201)
      .json({ status: "success", message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect username or password" });
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        return res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }

      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      return res.json({ status: "success", token });
    });
  })(req, res, next);
};

module.exports = { register, login };
