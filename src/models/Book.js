import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    publisher: { type: String },
    price: { type: Number },
    pages: { type: Number },
  },
  { versionKey: false }
);

const book = mongoose.model("Book", bookSchema, "livros");

export default book;
