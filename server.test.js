import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config.js";
import app from "./src/app.js";
import book from "./src/models/Book.js";

let server;
let testBookId;
let testBookId2;
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
    const appInstance = await app;
    await new Promise((resolve) => {
      server = appInstance.listen(PORT, resolve);
    });

    // Seed test data
    const book1 = await book.create({ title: "Test Book 1" });
    const book2 = await book.create({ title: "Test Book 2" });
    testBookId = book1._id.toString();
    testBookId2 = book2._id.toString();
  });

  afterAll(async () => {
    await book.deleteMany({});
    await mongoose.disconnect();
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
      const result = await makeRequest("GET", `/livros/${testBookId}`);
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.data.title).toBeDefined();
    });

    it("should return 404 for invalid id", async () => {
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
      expect(result.body.data.message).toBe("Livro cadastrado com sucesso");
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
      expect(result.body.data.message).toBe("Livro excluído com sucesso");
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
      const payload = {
        title: "Valid Book",
        _internal: "should_be_rejected",
        __proto__: "dangerous",
      };
      const result = await makeRequest("POST", "/livros", payload);
      expect(result.statusCode).toBe(400);
      expect(result.body.success).toBe(false);
    });

    it("should reject PUT with extra fields", async () => {
      const payload = {
        title: "Updated",
        _id: "different-id",
        __proto__: "dangerous",
      };
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
    it("should not expose stack trace in error response", async () => {
      const result = await makeRequest("GET", "/livros/invalid-id");
      expect(result.statusCode).toBe(404);
      expect(result.body.error).not.toContain("stack");
      expect(result.body.error).not.toContain("Error");
    });
  });
});
