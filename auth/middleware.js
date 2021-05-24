const User = require("../models").user;
const { toData } = require("./jwt");

async function auth(request, response, next) {
  const auth =
    request.headers.authorization && request.headers.authorization.split(" ");
  console.log(auth);
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      const user = await User.findByPk(data.userId);
      if (!user) {
        response.status(404).send("no user found");
      } else {
        request.user = user;
        next();
      }
    } catch (error) {
      response
        .status(400)
        .send({ message: `Error ${error.name}: ${error.message}` });
    }
  } else {
    response
      .status(401)
      .send({ message: "please supply some valid credentials" });
  }
}

module.exports = auth;
