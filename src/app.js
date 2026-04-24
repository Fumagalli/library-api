import express from "express";
import connectDataBase from "./config/dbConnect.js";
import routes from "./routes/index.js";

async function initializeApp() {
  const connection = await connectDataBase();

  connection.on("error", (error) => {
    console.error("Erro de conexão", error);
  });

  connection.once("open", () => {
    console.log("Conexão com o banco feita com sucesso");
  });

  const app = express();
  routes(app);

  return app;
}

export default initializeApp();
