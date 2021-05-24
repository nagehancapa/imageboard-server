const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models").user;

const router = new Router();

router.get("/", async (request, response, next) => {
  try {
    console.log("user route");
    const allUsers = await User.findAll();
    response.send(allUsers);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (request, response, next) => {
  try {
    // email, password, fullName
    const { email, password, fullName } = request.body;
    if (!email || !password || !fullName) {
      response.status(400).send("missing parameters");
    } else {
      const newUser = await User.create({
        email,
        password: bcrypt.hashSync(password, 10),
        fullName,
      });
      response.json(newUser);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
