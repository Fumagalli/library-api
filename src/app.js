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

function isValidBook(book) {
  return (
    book && typeof book.titulo === "string" && book.titulo.trim().length > 0
  );
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
  if (!isValidBook(req.body)) {
    return res.status(400).json({
      success: false,
      error: "Livro inválido: título é obrigatório",
    });
  }
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
