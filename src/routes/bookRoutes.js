import express from "express";
import BookController from "../controllers/bookController.js";

const bookRoutes = express.Router();

bookRoutes.get("/livros", BookController.getAllBooks);
bookRoutes.get("/livros/:id", BookController.getBookById);
bookRoutes.post("/livros", BookController.addBook);
bookRoutes.put("/livros/:id", BookController.updateBook);
bookRoutes.delete("/livros/:id", BookController.deleteBook);

export default bookRoutes;
