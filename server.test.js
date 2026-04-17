import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";
import app from "./src/app.js";

let server;
const PORT = 3001;

// Helper para fazer requisições HTTP
const makeRequest = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

describe("Library API - Endpoints", () => {
  beforeAll(async () => {
    await new Promise((resolve) => {
      server = app.listen(PORT, resolve);
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  describe("GET /", () => {
    it("should return 200 with welcome message", async () => {
      const result = await makeRequest("GET", "/");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.data.message).toBe("Curso de Node.js");
    });
  });

  describe("GET /livros", () => {
    it("should return 200 with all books", async () => {
      const result = await makeRequest("GET", "/livros");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(Array.isArray(result.body.data)).toBe(true);
      expect(result.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /livros/:id", () => {
    it("should return 200 with book details for valid id", async () => {
      const result = await makeRequest("GET", "/livros/1");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.data.id).toBe(1);
      expect(result.body.data.titulo).toBeDefined();
    });

    it("should return 404 for invalid id", async () => {
      const result = await makeRequest("GET", "/livros/999");
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
      expect(result.body.error).toBe("Livro não encontrado");
    });
  });

  describe("POST /livros", () => {
    it("should create new book successfully", async () => {
      const newBook = { titulo: "Harry Potter" };
      const result = await makeRequest("POST", "/livros", newBook);
      expect(result.statusCode).toBe(201);
      expect(result.body.success).toBe(true);
      expect(result.body.data.message).toBe("Livro cadastrado com sucesso");
    });

    it("should return 400 for invalid book", async () => {
      const result = await makeRequest("POST", "/livros", {});
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.error).toContain("título");
    });
  });

  describe("PUT /livros/:id", () => {
    it("should update book successfully", async () => {
      const update = { titulo: "O Senhor dos Anéis - Edição Especial" };
      const result = await makeRequest("PUT", "/livros/1", update);
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
    });

    it("should return 404 for non-existent book", async () => {
      const update = { titulo: "Novo Título" };
      const result = await makeRequest("PUT", "/livros/999", update);
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
    });

    it("should return 400 if titulo is missing", async () => {
      const result = await makeRequest("PUT", "/livros/1", {});
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });
  });

  describe("DELETE /livros/:id", () => {
    it("should delete book successfully", async () => {
      const result = await makeRequest("DELETE", "/livros/2");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
    });

    it("should return 404 for non-existent book", async () => {
      const result = await makeRequest("DELETE", "/livros/999");
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
    });
  });
});
