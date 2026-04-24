import express from "express";
import books from "./bookRoutes.js";
import authors from "./authorRoutes.js";
import { jsonErrorHandler } from "../middleware/jsonErrorHandler.js";

const routes = (app) => {
  app.use(express.json());

  app.route("/").get((req, res) =>
    res.status(200).json({
      success: true,
      message: "Curso de Node.js",
      data: {},
    })
  );

  app.use(books);
  app.use(authors);

  // Error handling for invalid JSON (must be after all routes)
  app.use(jsonErrorHandler);
};

export default routes;
