import http from "http";

// TODO: no futuro verificar se porta está disponivel, se não aumentar ela até achar uma disponivel
const PORT = 3000;

const rotas = {
  "/": { message: "Curso de Express API" },
  "/livros": { message: "Entrei na rota livros", books: [] },
  "/autores": { message: "Entrei na rota autores", authors: [] },
};

const server = http.createServer((req, res) => {
  const rota = rotas[req.url];

  if (rota) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ success: true, data: rota }));
  } else {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log("Servidor escutando!");
});
