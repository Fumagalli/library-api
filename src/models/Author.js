import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nationality: { type: String },
  },
  { versionKey: false }
);

const author = mongoose.model("Author", authorSchema, "autores");

export default author;
