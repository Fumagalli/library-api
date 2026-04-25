import express from "express";
import AuthorController from "../controllers/authorController.js";

const authorRoutes = express.Router();

authorRoutes.get("/autores", AuthorController.getAllAuthors);
authorRoutes.get("/autores/:id", AuthorController.getAuthorById);
authorRoutes.post("/autores", AuthorController.addAuthor);
authorRoutes.put("/autores/:id", AuthorController.updateAuthor);
authorRoutes.delete("/autores/:id", AuthorController.deleteAuthor);

export default authorRoutes;
