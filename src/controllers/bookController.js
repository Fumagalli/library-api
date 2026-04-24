import book from "../models/Book.js";
import logger from "../utils/logger.js";
import {
  bookCreateSchema,
  bookUpdateSchema,
  validateObjectId,
} from "../models/BookSchema.js";

class BookController {
  static async getAllBooks(req, res) {
    try {
      const bookList = await book.find({});

      res.status(200).json({
        success: true,
        data: bookList,
      });
    } catch (error) {
      logger.error("getAllBooks", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao buscar os livros",
      });
    }
  }

  static async getBookById(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "ID do livro inválido",
        });
      }

      const foundBook = await book.findById(id);

      if (!foundBook) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: "Livro não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: foundBook,
      });
    } catch (error) {
      logger.error("getBookById", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao buscar o livro",
      });
    }
  }

  static async addBook(req, res) {
    try {
      const validation = bookCreateSchema.safeParse(req.body);

      if (!validation.success) {
        const errors = validation.error.flatten();
        const firstError =
          Object.values(errors.fieldErrors)[0]?.[0] || "Dados inválidos";
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: firstError,
        });
      }

      const newBook = await book.create(validation.data);

      res.status(201).json({
        success: true,
        data: { message: "Livro cadastrado com sucesso", livro: newBook },
      });
    } catch (error) {
      logger.error("addBook", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao cadastrar o livro",
      });
    }
  }

  static async updateBook(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "ID do livro inválido",
        });
      }

      const validation = bookUpdateSchema.safeParse(req.body);

      if (!validation.success) {
        const errors = validation.error.flatten();
        const firstError =
          errors.formErrors[0] ||
          Object.values(errors.fieldErrors)[0]?.[0] ||
          "Dados inválidos";
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: firstError,
        });
      }

      const foundBook = await book.findByIdAndUpdate(id, validation.data, {
        returnDocument: "after",
        runValidators: true,
      });

      if (!foundBook) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: "Livro não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          message: "Livro atualizado com sucesso",
          livro: foundBook,
        },
      });
    } catch (error) {
      logger.error("updateBook", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao atualizar o livro",
      });
    }
  }

  static async deleteBook(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "ID do livro inválido",
        });
      }

      const foundBook = await book.findByIdAndDelete(id);

      if (!foundBook) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: "Livro não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          message: "Livro excluído com sucesso",
        },
      });
    } catch (error) {
      logger.error("deleteBook", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao excluir o livro",
      });
    }
  }
}

export default BookController;
