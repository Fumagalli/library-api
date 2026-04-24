import book from "../models/Book.js";
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
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Ocorreu um problema ao buscar os livros",
      });
    }
  }

  static async getBookById(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(404).json({
          success: false,
          error: "Livro não encontrado",
        });
      }

      const foundedBook = await book.findById(id);

      if (!foundedBook) {
        return res.status(404).json({
          success: false,
          error: "Livro não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: foundedBook,
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return res.status(500).json({
        success: false,
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
          error: firstError,
        });
      }

      const newBook = await book.create(validation.data);

      res.status(201).json({
        success: true,
        data: { message: "Livro cadastrado com sucesso", livro: newBook },
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Ocorreu um problema ao cadastrar o livro",
      });
    }
  }

  static async updateBook(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(404).json({
          success: false,
          error: "Livro não encontrado",
        });
      }

      const validation = bookUpdateSchema.safeParse(req.body);

      if (!validation.success) {
        const errors = validation.error.flatten();
        const firstError =
          Object.values(errors.fieldErrors)[0]?.[0] || "Dados inválidos";
        return res.status(400).json({
          success: false,
          error: firstError,
        });
      }

      const foundedBook = await book.findByIdAndUpdate(id, validation.data);

      if (!foundedBook) {
        return res.status(404).json({
          success: false,
          error: "Livro não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Livro atualizado com sucesso",
        livro: foundedBook,
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Ocorreu um problema ao atualizar o livro",
      });
    }
  }

  static async deleteBook(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(404).json({
          success: false,
          error: "Livro não encontrado",
        });
      }

      const foundedBook = await book.findByIdAndDelete(id);

      if (!foundedBook) {
        return res.status(404).json({
          success: false,
          error: "Livro não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Livro excluido com sucesso",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Ocorreu um problema ao excluir o livro",
      });
    }
  }
}

export default BookController;
