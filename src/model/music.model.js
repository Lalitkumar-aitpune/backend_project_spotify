const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  uri: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Your ref must match the model name, not the file name.
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
});

const musicModel = mongoose.model("music", artistSchema); 

module.exports = musicModel;