import express from "express";
import books from "./bookRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) =>
    res.status(200).json({
      success: true,
      message: "Curso de Node.js",
      data: {},
    })
  );

  app.use(express.json());
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: "Invalid JSON body",
      });
    }

    next(err);
  });
  app.use(books);
};

export default routes;
