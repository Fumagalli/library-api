import { describe, it, expect, beforeEach, vi } from "vitest";
import BookController from "./src/controllers/bookController.js";
import AuthorController from "./src/controllers/authorController.js";
import book from "./src/models/Book.js";
import author from "./src/models/Author.js";

// Mock the database models
vi.mock("./src/models/Book.js");
vi.mock("./src/models/Author.js");

describe("BookController - Database Error Handling", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: { id: "507f1f77bcf86cd799439011" },
      body: { title: "Test Book" },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  describe("getAllBooks error handling", () => {
    it("should return 500 when book.find() throws error", async () => {
      book.find.mockRejectedValueOnce(new Error("Database connection failed"));

      await BookController.getAllBooks(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao buscar os livros",
      });
    });

    it("should return 500 when book.find() throws generic error", async () => {
      book.find.mockRejectedValueOnce("Something went wrong");

      await BookController.getAllBooks(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getBookById error handling", () => {
    it("should return 400 for invalid book id", async () => {
      mockReq.params.id = "invalid-id";

      await BookController.getBookById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        error: "ID do livro inválido",
      });
    });

    it("should return 404 when book not found", async () => {
      book.findById.mockResolvedValueOnce(null);

      await BookController.getBookById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 404,
        error: "Livro não encontrado",
      });
    });

    it("should return 500 when book.findById() throws error", async () => {
      book.findById.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      await BookController.getBookById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao buscar o livro",
      });
    });
  });

  describe("addBook error handling", () => {
    it("should return 400 for invalid book data", async () => {
      mockReq.body = {};

      await BookController.addBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json.mock.calls[0][0].success).toBe(false);
    });

    it("should return 500 when book.create() throws error", async () => {
      book.create.mockRejectedValueOnce(new Error("Duplicate key error"));

      await BookController.addBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao cadastrar o livro",
      });
    });

    it("should return 500 with generic error from book.create()", async () => {
      book.create.mockRejectedValueOnce("Unknown error");

      await BookController.addBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateBook error handling", () => {
    it("should return 400 for invalid book id", async () => {
      mockReq.params.id = "invalid-id";

      await BookController.updateBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 for invalid update data", async () => {
      mockReq.body = { title: "" };

      await BookController.updateBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when book not found", async () => {
      book.findByIdAndUpdate.mockResolvedValueOnce(null);

      await BookController.updateBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 404,
        error: "Livro não encontrado",
      });
    });

    it("should return 500 when book.findByIdAndUpdate() throws error", async () => {
      book.findByIdAndUpdate.mockRejectedValueOnce(new Error("Update failed"));

      await BookController.updateBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao atualizar o livro",
      });
    });
  });

  describe("deleteBook error handling", () => {
    it("should return 400 for invalid book id", async () => {
      mockReq.params.id = "invalid-id";

      await BookController.deleteBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when book not found", async () => {
      book.findByIdAndDelete.mockResolvedValueOnce(null);

      await BookController.deleteBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 404,
        error: "Livro não encontrado",
      });
    });

    it("should return 500 when book.findByIdAndDelete() throws error", async () => {
      book.findByIdAndDelete.mockRejectedValueOnce(new Error("Delete failed"));

      await BookController.deleteBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao excluir o livro",
      });
    });
  });
});

describe("AuthorController - Database Error Handling", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: { id: "507f1f77bcf86cd799439011" },
      body: { name: "Test Author" },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  describe("getAllAuthors error handling", () => {
    it("should return 500 when author.find() throws error", async () => {
      author.find.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      await AuthorController.getAllAuthors(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao buscar os autores",
      });
    });
  });

  describe("getAuthorById error handling", () => {
    it("should return 400 for invalid author id", async () => {
      mockReq.params.id = "invalid-id";

      await AuthorController.getAuthorById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when author not found", async () => {
      author.findById.mockResolvedValueOnce(null);

      await AuthorController.getAuthorById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 404,
        error: "Autor não encontrado",
      });
    });

    it("should return 500 when author.findById() throws error", async () => {
      author.findById.mockRejectedValueOnce(new Error("Database error"));

      await AuthorController.getAuthorById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("addAuthor error handling", () => {
    it("should return 400 for invalid author data", async () => {
      mockReq.body = {};

      await AuthorController.addAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 when author.create() throws error", async () => {
      author.create.mockRejectedValueOnce(new Error("Create failed"));

      await AuthorController.addAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao cadastrar o autor",
      });
    });
  });

  describe("updateAuthor error handling", () => {
    it("should return 400 for invalid author id", async () => {
      mockReq.params.id = "invalid-id";

      await AuthorController.updateAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 for invalid update data", async () => {
      mockReq.body = { name: "" };

      await AuthorController.updateAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when author not found", async () => {
      author.findByIdAndUpdate.mockResolvedValueOnce(null);

      await AuthorController.updateAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 when author.findByIdAndUpdate() throws error", async () => {
      author.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Update failed")
      );

      await AuthorController.updateAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao atualizar o autor",
      });
    });
  });

  describe("deleteAuthor error handling", () => {
    it("should return 400 for invalid author id", async () => {
      mockReq.params.id = "invalid-id";

      await AuthorController.deleteAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when author not found", async () => {
      author.findByIdAndDelete.mockResolvedValueOnce(null);

      await AuthorController.deleteAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 when author.findByIdAndDelete() throws error", async () => {
      author.findByIdAndDelete.mockRejectedValueOnce(
        new Error("Delete failed")
      );

      await AuthorController.deleteAuthor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao excluir o autor",
      });
    });
  });
});
