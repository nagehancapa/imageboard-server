const { Router } = require("express");
const Image = require("../models").image;
const { toJWT, toData } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/", authMiddleware, async (request, response, next) => {
  try {
    console.log("image route");
    const allImages = await Image.findAll();
    response.send(allImages);
  } catch (e) {
    next(e);
  }
});

router.get("/messy", async (request, response, next) => {
  const auth =
    request.headers.authorization && request.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      console.log(auth);
      const data = toData(auth[1]);
      console.log("token", data);
    } catch (e) {
      next(e);
      response.status(400).send("invalid JWT token");
    }
    const allImages = await Image.findAll();
    response.send(allImages);
  } else {
    response
      .status(401)
      .send({ message: "please supply some valid credentials" });
  }
});

router.get("/:imageId", async (request, response, next) => {
  try {
    const imageId = parseInt(request.params.imageId);
    console.log(imageId);
    const image = await Image.findByPk(imageId);
    console.log(image);
    if (!image) {
      response.status(404).send("image not found");
    } else {
      response.send(image);
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", async (request, response, next) => {
  try {
    // title, imgUrl
    const { title, imgUrl } = request.body;
    if (!title || !imgUrl) {
      response.status(400).send("missing parameters");
    } else {
      const image = await Image.create({ title: title, imgUrl: imgUrl });
      console.log(image);
      response.send(image);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
