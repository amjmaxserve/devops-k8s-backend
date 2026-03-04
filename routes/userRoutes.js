const express = require("express");
const router = express.Router();
const User = require("../models/User");


// CREATE USER
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);

    const savedUser = await user.save();

    res.json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});


// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
