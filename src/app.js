import express from "express";
import connectDataBase from "./config/dbConnect.js";
import routes from "./routes/index.js";

export function handleConnectionError(error) {
  console.error("Erro de conexão", error);
}

export function handleConnectionOpen() {
  console.log("Conexão com o banco feita com sucesso");
}

async function initializeApp() {
  const connection = await connectDataBase();

  connection.on("error", handleConnectionError);
  connection.once("open", handleConnectionOpen);

  const app = express();
  routes(app);

  return app;
}

export default initializeApp();
