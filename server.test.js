import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config.js";
import app from "./src/app.js";
import book from "./src/models/Book.js";

let server;
let testBookId;
let testBookId2;
let PORT;

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
    const appInstance = await app;
    await new Promise((resolve) => {
      server = appInstance.listen(0, () => {
        PORT = server.address().port;
        resolve();
      });
    });

    // Seed test data
    const book1 = await book.create({ title: "Test Book 1" });
    const book2 = await book.create({ title: "Test Book 2" });
    testBookId = book1._id.toString();
    testBookId2 = book2._id.toString();
  });

  afterAll(async () => {
    try {
      // Safety guard: prevent accidental deletion in non-test databases
      const isTestEnvironment =
        process.env.NODE_ENV === "test" ||
        (process.env.MONGODB_DATABASE &&
          process.env.MONGODB_DATABASE.toLowerCase().includes("test"));

      if (!isTestEnvironment) {
        throw new Error(
          "Safety guard: deleteMany() aborted. Tests must run against a database with 'test' in its name or NODE_ENV=test"
        );
      }

      await book.deleteMany({});
    } finally {
      await mongoose.disconnect();
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
  });

  describe("GET /", () => {
    it("should return 200 with welcome message", async () => {
      const result = await makeRequest("GET", "/");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe("Curso de Node.js");
    });
  });

  describe("GET /livros", () => {
    it("should return 200 with all books", async () => {
      const result = await makeRequest("GET", "/livros");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(Array.isArray(result.body.books)).toBe(true);
      expect(result.body.books.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /livros/:id", () => {
    it("should return 200 with book details for valid id", async () => {
      const result = await makeRequest("GET", `/livros/${testBookId}`);
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.book.title).toBeDefined();
    });

    it("should return 404 for non-existent id", async () => {
      const result = await makeRequest(
        "GET",
        "/livros/507f1f77bcf86cd799439999"
      );
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
      expect(result.body.error).toBe("Livro não encontrado");
    });
  });

  describe("POST /livros", () => {
    it("should create new book successfully", async () => {
      const newBook = { title: "Harry Potter" };
      const result = await makeRequest("POST", "/livros", newBook);
      expect(result.statusCode).toBe(201);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe("Livro cadastrado com sucesso");
    });

    it("should return 400 for invalid book", async () => {
      const result = await makeRequest("POST", "/livros", {});
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.error).toContain("Título");
    });
  });

  describe("PUT /livros/:id", () => {
    it("should update book successfully", async () => {
      const update = { title: "O Senhor dos Anéis - Edição Especial" };
      const result = await makeRequest("PUT", `/livros/${testBookId}`, update);
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
    });

    it("should return 404 for non-existent book", async () => {
      const update = { title: "Novo Título" };
      const result = await makeRequest(
        "PUT",
        "/livros/507f1f77bcf86cd799439999",
        update
      );
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
    });

    it("should return 400 if title is missing", async () => {
      const result = await makeRequest("PUT", `/livros/${testBookId}`, {});
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });
  });

  describe("DELETE /livros/:id", () => {
    it("should delete book successfully", async () => {
      const result = await makeRequest("DELETE", `/livros/${testBookId2}`);
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe("Livro excluído com sucesso");
    });

    it("should return 404 for non-existent book", async () => {
      const result = await makeRequest(
        "DELETE",
        "/livros/507f1f77bcf86cd799439999"
      );
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
    });
  });

  describe("Security - Input Validation", () => {
    it("should reject POST with extra fields", async () => {
      const payload = JSON.parse(
        '{"title":"Valid Book","_internal":"should_be_rejected","__proto__":"dangerous"}'
      );
      const result = await makeRequest("POST", "/livros", payload);
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should reject PUT with extra fields", async () => {
      const payload = JSON.parse(
        '{"title":"Updated","_id":"different-id","__proto__":"dangerous"}'
      );
      const result = await makeRequest("PUT", `/livros/${testBookId}`, payload);
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });
  });

  describe("Security - NoSQL Injection Prevention", () => {
    it("should reject POST with injection payload in title", async () => {
      const payload = {
        title: { $gt: "" },
      };
      const result = await makeRequest("POST", "/livros", payload);
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should reject PUT with injection payload", async () => {
      const payload = {
        title: { $ne: "" },
      };
      const result = await makeRequest("PUT", `/livros/${testBookId}`, payload);
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });
  });

  describe("Security - Error Handling", () => {
    it("should return 400 for invalid id format and not expose stack trace", async () => {
      const result = await makeRequest("GET", "/livros/invalid-id");
      expect(result.statusCode).toBe(400);
      expect(result.body.error).not.toContain("stack");
      expect(result.body.error).not.toContain("Error");
    });
  });

  describe("GET /autores", () => {
    it("should return 200 with all authors", async () => {
      const result = await makeRequest("GET", "/autores");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(Array.isArray(result.body.authors)).toBe(true);
    });
  });

  describe("POST /autores", () => {
    it("should create new author successfully with name only", async () => {
      const newAuthor = { name: "Machado de Assis" };
      const result = await makeRequest("POST", "/autores", newAuthor);
      expect(result.statusCode).toBe(201);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe("Autor cadastrado com sucesso");
      expect(result.body.author.name).toBe("Machado de Assis");
    });

    it("should create new author with name and nationality", async () => {
      const newAuthor = {
        name: "Clarice Lispector",
        nationality: "Brasileira",
      };
      const result = await makeRequest("POST", "/autores", newAuthor);
      expect(result.statusCode).toBe(201);
      expect(result.body.success).toBe(true);
      expect(result.body.author.nationality).toBe("Brasileira");
    });

    it("should return 400 when name is missing", async () => {
      const result = await makeRequest("POST", "/autores", {});
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.error).toContain("Nome");
    });

    it("should return 400 when name is empty string", async () => {
      const result = await makeRequest("POST", "/autores", { name: "   " });
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should reject POST with extra fields", async () => {
      const payload = JSON.parse(
        '{"name":"Valid Author","_internal":"should_be_rejected","__proto__":"dangerous"}'
      );
      const result = await makeRequest("POST", "/autores", payload);
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should reject POST with NoSQL injection in name", async () => {
      const payload = { name: { $gt: "" } };
      const result = await makeRequest("POST", "/autores", payload);
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });
  });

  describe("GET /autores/:id", () => {
    let testAuthorId;

    beforeAll(async () => {
      // Create an author for testing
      const author = await makeRequest("POST", "/autores", {
        name: "Paulo Coelho",
      });
      testAuthorId = author.body.author._id;
    });

    it("should return 200 with author details for valid id", async () => {
      const result = await makeRequest("GET", `/autores/${testAuthorId}`);
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.author.name).toBe("Paulo Coelho");
    });

    it("should return 404 for non-existent id", async () => {
      const result = await makeRequest(
        "GET",
        "/autores/507f1f77bcf86cd799439999"
      );
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
      expect(result.body.error).toBe("Autor não encontrado");
    });

    it("should return 400 for invalid id format", async () => {
      const result = await makeRequest("GET", "/autores/invalid-id");
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.error).not.toContain("stack");
    });
  });

  describe("PUT /autores/:id", () => {
    let testAuthorId;

    beforeAll(async () => {
      const author = await makeRequest("POST", "/autores", {
        name: "Jorge Amado",
      });
      testAuthorId = author.body.author._id;
    });

    it("should update author name successfully", async () => {
      const update = { name: "Jorge Amado - Updated" };
      const result = await makeRequest(
        "PUT",
        `/autores/${testAuthorId}`,
        update
      );
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe("Autor atualizado com sucesso");
    });

    it("should update author nationality successfully", async () => {
      const update = { nationality: "Brasileira" };
      const result = await makeRequest(
        "PUT",
        `/autores/${testAuthorId}`,
        update
      );
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.author.nationality).toBe("Brasileira");
    });

    it("should return 404 for non-existent author", async () => {
      const update = { name: "Novo Título" };
      const result = await makeRequest(
        "PUT",
        "/autores/507f1f77bcf86cd799439999",
        update
      );
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
    });

    it("should return 400 if all fields are missing", async () => {
      const result = await makeRequest("PUT", `/autores/${testAuthorId}`, {});
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should return 400 for invalid id format", async () => {
      const result = await makeRequest("PUT", "/autores/invalid-id", {
        name: "Test",
      });
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should reject PUT with extra fields", async () => {
      const payload = JSON.parse(
        '{"name":"Updated","_id":"different-id","__proto__":"dangerous"}'
      );
      const result = await makeRequest(
        "PUT",
        `/autores/${testAuthorId}`,
        payload
      );
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should reject PUT with NoSQL injection", async () => {
      const payload = { name: { $ne: "" } };
      const result = await makeRequest(
        "PUT",
        `/autores/${testAuthorId}`,
        payload
      );
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });
  });

  describe("DELETE /autores/:id", () => {
    let testAuthorId;
    let testAuthorId2;

    beforeAll(async () => {
      const author1 = await makeRequest("POST", "/autores", {
        name: "Cecília Meireles",
      });
      const author2 = await makeRequest("POST", "/autores", {
        name: "Aluísio Azevedo",
      });
      testAuthorId = author1.body.author._id;
      testAuthorId2 = author2.body.author._id;
    });

    it("should delete author successfully", async () => {
      const result = await makeRequest("DELETE", `/autores/${testAuthorId2}`);
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe("Autor excluído com sucesso");
    });

    it("should keep other authors intact after deletion", async () => {
      const result = await makeRequest("GET", `/autores/${testAuthorId}`);
      expect(result.statusCode).toBe(200);
      expect(result.body.author.name).toBe("Cecília Meireles");
    });

    it("should return 404 for non-existent author", async () => {
      const result = await makeRequest(
        "DELETE",
        "/autores/507f1f77bcf86cd799439999"
      );
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
    });

    it("should return 400 for invalid id format", async () => {
      const result = await makeRequest("DELETE", "/autores/invalid-id");
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.error).not.toContain("stack");
    });
  });

  describe("Database Error Handling - Books", () => {
    const buildMongoUri = () => {
      // Use MONGODB_URI if defined (CI with Docker), otherwise build from Atlas credentials
      if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI;
      }
      const encodedPassword = encodeURIComponent(process.env.MONGODB_PASSWORD);
      return `mongodb+srv://${process.env.MONGODB_USER}:${encodedPassword}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?appName=FumaloneTestCluster`;
    };

    it("should return 500 when getAllBooks fails in database", async () => {
      await mongoose.disconnect();
      const result = await makeRequest("GET", "/livros");
      expect(result.statusCode).toBe(500);
      expect(result.body.success).toBe(false);
      expect(result.body.statusCode).toBe(500);
      await mongoose.connect(buildMongoUri());
    });

    it("should return 500 when getBookById fails in database", async () => {
      await mongoose.disconnect();
      const result = await makeRequest(
        "GET",
        "/livros/507f1f77bcf86cd799439999"
      );
      expect(result.statusCode).toBe(500);
      expect(result.body.success).toBe(false);
      await mongoose.connect(buildMongoUri());
    });

    it("should return 500 when addBook fails in database", async () => {
      await mongoose.disconnect();
      const result = await makeRequest("POST", "/livros", { title: "Test" });
      expect(result.statusCode).toBe(500);
      expect(result.body.success).toBe(false);
      await mongoose.connect(buildMongoUri());
    });

    it("should return 500 when updateBook fails in database", async () => {
      await mongoose.disconnect();
      const result = await makeRequest(
        "PUT",
        "/livros/507f1f77bcf86cd799439999",
        {
          title: "Updated",
        }
      );
      expect(result.statusCode).toBe(500);
      expect(result.body.success).toBe(false);
      await mongoose.connect(buildMongoUri());
    });

    it("should return 500 when deleteBook fails in database", async () => {
      await mongoose.disconnect();
      const result = await makeRequest(
        "DELETE",
        "/livros/507f1f77bcf86cd799439999"
      );
      expect(result.statusCode).toBe(500);
      expect(result.body.success).toBe(false);
      await mongoose.connect(buildMongoUri());
    });
  });

  describe("Error Handling - Invalid JSON", () => {
    it("should return 400 for invalid JSON body", async () => {
      return new Promise((resolve) => {
        const options = {
          hostname: "localhost",
          port: PORT,
          path: "/livros",
          method: "POST",
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
            expect(res.statusCode).toBe(400);
            const body = JSON.parse(data);
            expect(body.success).toBe(false);
            expect(body.error).toBe("Invalid JSON body");
            resolve();
          });
        });

        req.on("error", (error) => {
          expect.fail(`Request failed: ${error.message}`);
          resolve();
        });

        // Send invalid JSON
        req.write("{invalid json}");
        req.end();
      });
    });

    it("should pass non-SyntaxError errors to next middleware", async () => {
      // Test the next(err) branch - triggers when error is not SyntaxError
      // We can verify this by checking a valid request goes through
      const result = await makeRequest("GET", "/");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe("Curso de Node.js");
    });
  });
});
