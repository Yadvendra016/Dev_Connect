const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [2, "First name must be at least 2 characters"],
    maxLength: [50, "First name cannot exceed 50 characters"],
  },
  lastName: {
    type: String,
    maxLength: [50, "Last name cannot exceed 50 characters"],
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address: " + value);
      }
    },
  },
  password: {
    type: String,
    minLength: 6,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
    validate: {
      validator: Number.isInteger,
      message: "Age must be a whole number",
    },
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: `{VALUE} is valid gender type`,
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photoUrl");
      }
    },
  },
  about: {
    type: String,
    default: "This is a default about of the user!",
  },
  skills: {
    type: [String],
  },
  timestamp: { type: Date, default: Date.now, immutable: true },
});

// generate jwt token
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Yadvendramuthalshukla", {
    expiresIn: "7d",
  });
  return token;
};

// hashed the password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
