import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";

// Setup do servidor para testes
let server;
const PORT = 3001; // Porta diferente para testes

const createTestServer = () => {
  const rotas = {
    "/": { message: "Curso de Express API" },
    "/livros": { message: "Entrei na rota livros", books: [] },
    "/autores": { message: "Entrei na rota autores", authors: [] },
  };

  return http.createServer((req, res) => {
    const rota = rotas[req.url];

    if (rota) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: true, data: rota }));
    } else {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Route not found" }));
    }
  });
};

// Helper para fazer requisições HTTP
const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path,
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(data),
        });
      });
    });

    req.on("error", reject);
    req.end();
  });
};

describe("Library API - Basic Routes", () => {
  beforeAll((done) => {
    server = createTestServer();
    server.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("GET /", () => {
    it("should return 200 with welcome message", async () => {
      const result = await makeRequest("/");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.data.message).toBe("Curso de Express API");
    });
  });

  describe("GET /livros", () => {
    it("should return 200 with books route message", async () => {
      const result = await makeRequest("/livros");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.data.message).toBe("Entrei na rota livros");
      expect(Array.isArray(result.body.data.books)).toBe(true);
    });
  });

  describe("GET /autores", () => {
    it("should return 200 with authors route message", async () => {
      const result = await makeRequest("/autores");
      expect(result.statusCode).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.data.message).toBe("Entrei na rota autores");
      expect(Array.isArray(result.body.data.authors)).toBe(true);
    });
  });

  describe("GET /not-found", () => {
    it("should return 404 for undefined route", async () => {
      const result = await makeRequest("/not-found");
      expect(result.statusCode).toBe(404);
      expect(result.body.success).toBe(false);
      expect(result.body.error).toBe("Route not found");
    });
  });

  describe("Response Format", () => {
    it("should always return JSON with success flag", async () => {
      const result = await makeRequest("/");
      expect(result.body).toHaveProperty("success");
      expect(result.body).toHaveProperty("data");
    });
  });
});
