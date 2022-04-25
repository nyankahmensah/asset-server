"use strict";

const cors = require("cors");
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const port = process.env.PORT || 5001;

const ensureDir = (directory) => !fs.existsSync(directory) ? fs.mkdirSync(directory,"0777", true) : null;

const assetRoot = path.join(__dirname, "public");
ensureDir(assetRoot);
const imagesRoot = path.join(assetRoot, "images");
ensureDir(imagesRoot);
const videosRoot = path.join(assetRoot, "videos");
ensureDir(videosRoot);
const filesRoot = path.join(assetRoot, "files");
ensureDir(filesRoot);

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const fileType = file.mimetype.split("/")[0];
      console.log(fileType  === "image")
      if(fileType === "image") cb(null, imagesRoot);
      else if(fileType === "video") cb(null, videosRoot);
      else cb(null, filesRoot);
    },
    filename: function (req, file, cb) {
      const fileExt = file.mimetype.split("/")[1];
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExt)
    }
  })
});

const app = express();
app.use(cors());
app.use("/static", express.static(assetRoot));

app.use(
  "/upload",
  upload.single("file"),
  (req, res) => {
    console.log(req.file)
    res.status(200).send("/static/images/" + req.file.filename)
  }
);

app.use(
  "/upload/many",
  upload.array("files", 10),
  (req, res) => {
    res.status(200).send(req.files.map(file => "/static/images/" + file.filename))
  }
);

app.listen(port, () => {
  console.log(`Asset server running on port ${port}`);
});
