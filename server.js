import "dotenv/config.js";
import app from "./src/app.js";

// TODO: no futuro verificar se porta está disponivel, se não aumentar ela até achar uma disponivel
const PORT = 3000;

const application = await app;

application.listen(PORT, () => {
  console.log("Servidor escutando!");
});
