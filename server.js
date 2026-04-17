// import http from "http";
import app from "./src/app.js";
// TODO: no futuro verificar se porta está disponivel, se não aumentar ela até achar uma disponivel
const PORT = 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log("Servidor escutando!");
});
