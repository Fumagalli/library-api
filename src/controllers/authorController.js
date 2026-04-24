import author from "../models/Author.js";
import logger from "../utils/logger.js";
import {
  authorCreateSchema,
  authorUpdateSchema,
  validateObjectId,
} from "../models/AuthorSchema.js";

class AuthorController {
  static async getAllAuthors(req, res) {
    try {
      const authorList = await author.find({});

      res.status(200).json({
        success: true,
        authors: authorList,
      });
    } catch (_error) {
      logger.error("getAllAuthors", _error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao buscar os autores",
      });
    }
  }

  static async getAuthorById(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "ID do autor inválido",
        });
      }

      const foundAuthor = await author.findById(id);

      if (!foundAuthor) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: "Autor não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        author: foundAuthor,
      });
    } catch (_error) {
      logger.error("getAuthorById", _error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao buscar o autor",
      });
    }
  }

  static async addAuthor(req, res) {
    try {
      const parseResult = authorCreateSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.flatten();
        const error =
          errors.formErrors?.[0] || Object.values(errors.fieldErrors)[0]?.[0];
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error,
        });
      }

      const { data: authorPayload } = parseResult;
      const newAuthor = await author.create(authorPayload);

      res.status(201).json({
        success: true,
        message: "Autor cadastrado com sucesso",
        author: newAuthor,
      });
    } catch (_error) {
      logger.error("addAuthor", _error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao cadastrar o autor",
      });
    }
  }

  static async updateAuthor(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "ID do autor inválido",
        });
      }

      const parseResult = authorUpdateSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.flatten();
        const error =
          errors.formErrors?.[0] || Object.values(errors.fieldErrors)[0]?.[0];
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error,
        });
      }

      const { data: authorPayload } = parseResult;
      const foundAuthor = await author.findByIdAndUpdate(id, authorPayload, {
        returnDocument: "after",
        runValidators: true,
      });

      if (!foundAuthor) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: "Autor não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Autor atualizado com sucesso",
        author: foundAuthor,
      });
    } catch (_error) {
      logger.error("updateAuthor", _error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao atualizar o autor",
      });
    }
  }

  static async deleteAuthor(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "ID do autor inválido",
        });
      }

      const foundAuthor = await author.findByIdAndDelete(id);

      if (!foundAuthor) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: "Autor não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Autor excluído com sucesso",
        author: {},
      });
    } catch (_error) {
      logger.error("deleteAuthor", _error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Ocorreu um problema ao excluir o autor",
      });
    }
  }
}

export default AuthorController;
