const { Router } = require("express");
const bcrypt = require("bcrypt");
const { toJWT } = require("../auth/jwt");
const User = require("../models").user;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.post("/login", async (request, response, next) => {
  try {
    // email, password
    const { email, password } = request.body;
    const user = await User.findOne({ where: { email: email } });

    if (!email || !password) {
      return response
        .status(400)
        .send({ message: "Please supply a valid email and password" });
    } // const validPassword = password === user.password;
    else if (bcrypt.compareSync(password, user.password)) {
      const token = toJWT({ userId: user.id });
      response.send({
        message: "logged in",
        token,
      });
    } else {
      response.status(400).send("wrong credentials");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/test-auth", authMiddleware, (request, response) => {
  response.send({
    message: `thanks for visiting the secret endpoint ${request.user.email}`,
  });
});

module.exports = router;
