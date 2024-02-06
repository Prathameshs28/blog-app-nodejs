const express = require("express");
const path = require("path");
const userRoute = require("./routes/user.route");
const blogRoute = require('./routes/blog.route');
const Blog = require('./models/blog.model');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const { checkAuthenticatedByCookie } = require("./middlewares/auth.middleware");
const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e) => {
  console.log("mongodb connected");
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticatedByCookie("token"));
app.use(express.static(path.resolve("./public")))
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async(req, res) => {
  const blogData = await Blog.find({});
  res.render("home", {user: req.user,blogs:blogData});
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);


app.listen(PORT, () => console.log("server started at port ", PORT));
