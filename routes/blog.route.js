const { Router } = require("express");
const router = Router();
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog.model");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`./public/uploads/${req.user._id}`)) {
      fs.mkdirSync(`./public/uploads/${req.user._id}`);
    }

    cb(null, path.resolve(`./public/uploads/${req.user._id}`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  console.log(req.file);
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.user._id}/${req.file.filename}`,
  });

  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const imgUrl = blog.coverImageUrl;
  fs.unlink(`./public/${imgUrl}`, async (err) => {
    if (err) {
      console.error(err);
      return;
    }
    await Blog.findByIdAndDelete(req.params.id);
    return res.render("/",{msg:"File deleted successfully"});
  });
});

module.exports = router;
