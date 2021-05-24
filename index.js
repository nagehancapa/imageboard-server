const express = require("express");
const imageRouter = require("./routers/image");
const userRouter = require("./routers/user");
const loginRouter = require("./routers/auth");
const authMiddleware = require("./auth/middleware");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/images", authMiddleware, imageRouter);
// app.use("/images", imageRouter);
app.use("/users", userRouter);
app.use("/auth", loginRouter);

app.listen(PORT, () => console.log("server running"));
