const User = require("../models/user");
const express = require("express");
const multer = require("multer");
const auth = require("../middlewere/auth");
const router = new express.Router();
const sharp = require("sharp");
const {sendWelcomeEmail, sendCancelationEmail} = require("../emails/account")
const isValidUpdate = (allowedUpdates, updateData) => {
  const updateFields = Object.keys(updateData);
  const isValidOperation = updateFields.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return false;
  }
  return true;
};

// Set new user (Signup) - - No middlewere
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    console.log(user.email,user.name)
    sendWelcomeEmail(user.email,user.name);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login exsisting user - No middlewere
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

//Logout single user
router.post("/users/logout", auth, async (req, res) => {
  try {
    const { token, user } = req;
    user.tokens = user.tokens.filter((_token) => token !== _token.token);
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//Logout all users
router.post("/users/logoutAll", auth, (req, res) => {
  try {
    const { user } = req;
    user.tokens = [];
    user.save();
    res.status(200).send("Logged Out");
  } catch (error) {
    res.status(500).send();
  }
});

// Get all users - with auth middlewere
router.get("/users/me", auth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

const upload = multer({
  // dest: "avatars",
  limits: {
    //1mb
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    // if(!file.originalname.endsWith('.pdf')){
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Please upload an image"));
    }
    callback(undefined, true);
  },
});
router.post(  "/users/me/avatar",  auth,  upload.single("avatar"),  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

      req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  sendCancelationEmail(req.user.email, req.user.name)
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(401).send("User Not Found");
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

//Update user
router.patch("/users/me", auth, async (req, res) => {
  const updateInfo = req.body;
  const allowedUpdates = ["name", "email", "password", "age"];

  if (!isValidUpdate(allowedUpdates, updateInfo)) {
    return res.status(400).send("error:invalid update");
  }

  const updateFields = Object.keys(updateInfo);
  try {
    const user = req.user;
    updateFields.map((updateFiled) => {
      user[updateFiled] = updateInfo[updateFiled];
    });
    await user.save();
    // findByIdAndUpdate - not support middlewere
    user ? res.send(user) : res.status(404).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete user
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const _id = req.user._id;
    // const user = await User.findByIdAndDelete(_id);
    // if (!user) {
    //   return res.status(400).send("user not found");
    // }
    const { user } = req;
    await user.remove();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
