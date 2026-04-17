import express from "express";

const app = express();
app.use(express.json());

const livros = [
  {
    id: 1,
    titulo: "O senhor dos Anéis",
  },
  {
    id: 2,
    titulo: "O Hobbit",
  },
];

function searchBookById(id) {
  return livros.findIndex((livro) => {
    return livro.id === Number(id);
  });
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: { message: "Curso de Node.js" },
  });
});

app.get("/livros", (req, res) => {
  res.status(200).json({
    success: true,
    data: livros,
  });
});

app.get("/livros/:id", (req, res) => {
  const index = searchBookById(req.params.id);
  res.status(200).json({
    success: true,
    data: livros[index],
  });
});

app.post("/livros", (req, res) => {
  livros.push(req.body);
  res.status(201).json({
    success: true,
    data: { message: "Livro cadastrado com sucesso" },
  });
});

app.put("/livros/:id", (req, res) => {
  const index = searchBookById(req.params.id);
  livros[index].titulo = req.body.titulo;
  res.status(200).json({
    success: true,
    data: { message: "Livro atualizado com sucesso" },
  });
});

app.delete("/livros/:id", (req, res) => {
  const index = searchBookById(req.params.id);
  livros.splice(index, 1);
  res.status(200).json({
    success: true,
    data: { message: "Livro removido com sucesso" },
  });
});

export default app;
