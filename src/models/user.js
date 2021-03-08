const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");
//Middlewere - allows us to register pre\post save events
// usecase: hash password
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(val) {
        if (val.toLowerCase().includes("password")) {
          throw new Error("Password can not contain 'password'");
        }
      },
    },
    email: {
      type: String,
      requred: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Email is invalid");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timeStampe: true,
  }
);

//Set relationship between User and Task as virtual field on the user
// virtual field does not saved on db
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//Add findByCredentials function to userSchema
userSchema.statics.findByCredentials = async (email, password) => {
  console.log("start");

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  console.log("user found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  console.log("password match");
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const jwtPayload = { _id: user.id.toString() };
  const jwtSecret = "stringToEncodeJWT";
  const jwtOptions = { expiresIn: "7 days" };
  const token = jwt.sign(jwtPayload, jwtSecret, jwtOptions);
  // user.tokens = user.tokens.push({token})
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

// Can add middlewere pre/post mongoose middlewere events
//Hash plain text password before saving;
userSchema.pre("save", async function (next) {
  const user = this;
  console.log("Before saving user event");
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  console.log("Before removing user event");
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

//  const me = new User({
//    name: "Barak  ",
//    password:"33",
//    email:"BARakfisher@gmail.com",
//    age:33
//  });

//  me.save()
//    .then((res) => {
//      console.log(res);
//    })
//    .catch((err) => {
//      console.log(err);
//    });
