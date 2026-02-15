const artistModel = require("../model/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile , deleteFile } = require("../service/storage.service");
// create a music

async function CreateMusic(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded : ", decoded);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const result = await uploadFile(req.file.buffer.toString("base64"));

    const newMusic = await artistModel.create({
      uri: result.url,
      title: req.body.title,
      artist: decoded.id,
      fileId: result.fileId,
    });

    res.status(201).json({
      message: "Music created successfully",
      music: newMusic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function deleteSong(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const role = decoded.role;

    if(role !== "admin"){
      return res.status(403).json({ message : "Unauthorized"});
    }
    const {id} = req.params;
    const song = await artistModel.findById(id);

    if(!song){
      return res.status(404).json({ message: "Song not found" });
    }

    if(song.artist.toString() != decoded.id){
      return res.status(403).json({ message: "Unauthorized" });
    }

    await deleteFile(song.fileId) // delete from Imagekit

    await artistModel.findByIdAndDelete(id) // delete from mongodb

    res.status(200).json({ message: "Song deleted successfully" });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function showSong(req,res){
  try {
    const music = await artistModel.find().populate("artist", "username email");

    res.status(200).json({
      success: true,
      data: music,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { CreateMusic, deleteSong , showSong};
