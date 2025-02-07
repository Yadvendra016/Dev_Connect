const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read the token from the req cookies
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Please Login");

    // validate the token
    const decodedMessage = await jwt.verify(token, "Yadvendramuthalshukla");
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) throw new Error("No user found");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = {
  userAuth,
};
