const express = require("express");
const router = express.Router();
const { CreateMusic , deleteSong, showSong } = require("../controllers/music.controller");
const multer = require("multer");
const musicModel = require("../model/music.model");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/upload", upload.single("file"), CreateMusic);

router.delete("/:id", deleteSong);

router.get("/", showSong);

module.exports = router;
