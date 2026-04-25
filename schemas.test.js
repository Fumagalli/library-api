import { describe, it, expect } from "vitest";
import { ObjectId } from "mongodb";
import {
  bookCreateSchema,
  bookUpdateSchema,
  validateObjectId,
} from "./src/models/BookSchema.js";
import {
  authorCreateSchema,
  authorUpdateSchema,
  validateObjectId as validateAuthorObjectId,
} from "./src/models/AuthorSchema.js";

describe("Validation Schemas - validateObjectId", () => {
  describe("BookSchema validateObjectId", () => {
    it("should return true for valid ObjectId", () => {
      const validId = new ObjectId().toString();
      expect(validateObjectId(validId)).toBe(true);
    });

    it("should return true for valid ObjectId without toString", () => {
      const validId = "507f1f77bcf86cd799439011";
      expect(validateObjectId(validId)).toBe(true);
    });

    it("should return false for invalid ObjectId", () => {
      expect(validateObjectId("invalid-id")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(validateObjectId("")).toBe(false);
    });

    it("should return false for null", () => {
      expect(validateObjectId(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(validateObjectId(undefined)).toBe(false);
    });

    it("should return false for too short ID", () => {
      expect(validateObjectId("507f1f77bcf86cd")).toBe(false);
    });
  });

  describe("AuthorSchema validateObjectId", () => {
    it("should return true for valid ObjectId", () => {
      const validId = new ObjectId().toString();
      expect(validateAuthorObjectId(validId)).toBe(true);
    });

    it("should return false for invalid ObjectId", () => {
      expect(validateAuthorObjectId("invalid-author-id")).toBe(false);
    });
  });
});

describe("Validation Schemas - BookSchema", () => {
  describe("bookCreateSchema", () => {
    it("should accept valid book with title only", () => {
      const result = bookCreateSchema.safeParse({ title: "Harry Potter" });
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("Harry Potter");
    });

    it("should accept book with all fields", () => {
      const book = {
        title: "The Lord of the Rings",
        publisher: "Allen & Unwin",
        price: 29.99,
        pages: 623,
      };
      const result = bookCreateSchema.safeParse(book);
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("The Lord of the Rings");
      expect(result.data.publisher).toBe("Allen & Unwin");
      expect(result.data.price).toBe(29.99);
      expect(result.data.pages).toBe(623);
    });

    it("should trim title whitespace", () => {
      const result = bookCreateSchema.safeParse({ title: "  Book Title  " });
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("Book Title");
    });

    it("should reject empty title string", () => {
      const result = bookCreateSchema.safeParse({ title: "   " });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.title?.[0]).toBe(
        "Título é obrigatório"
      );
    });

    it("should reject missing title", () => {
      const result = bookCreateSchema.safeParse({ publisher: "Test" });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    });

    it("should reject non-string title", () => {
      const result = bookCreateSchema.safeParse({ title: 123 });
      expect(result.success).toBe(false);
    });

    it("should reject extra fields (strict mode)", () => {
      const result = bookCreateSchema.safeParse({
        title: "Book",
        extraField: "should not be here",
      });
      expect(result.success).toBe(false);
    });

    it("should accept optional publisher", () => {
      const result = bookCreateSchema.safeParse({
        title: "Book",
        publisher: "Pub",
      });
      expect(result.success).toBe(true);
      expect(result.data.publisher).toBe("Pub");
    });

    it("should accept optional price as number", () => {
      const result = bookCreateSchema.safeParse({
        title: "Book",
        price: 19.99,
      });
      expect(result.success).toBe(true);
      expect(result.data.price).toBe(19.99);
    });

    it("should accept optional pages as number", () => {
      const result = bookCreateSchema.safeParse({
        title: "Book",
        pages: 300,
      });
      expect(result.success).toBe(true);
      expect(result.data.pages).toBe(300);
    });

    it("should reject non-string publisher", () => {
      const result = bookCreateSchema.safeParse({
        title: "Book",
        publisher: 123,
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-number price", () => {
      const result = bookCreateSchema.safeParse({
        title: "Book",
        price: "19.99",
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-number pages", () => {
      const result = bookCreateSchema.safeParse({
        title: "Book",
        pages: "300",
      });
      expect(result.success).toBe(false);
    });

    it("should reject NoSQL injection in title", () => {
      const result = bookCreateSchema.safeParse({
        title: { $gt: "" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("bookUpdateSchema", () => {
    it("should accept title update", () => {
      const result = bookUpdateSchema.safeParse({ title: "Updated Title" });
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("Updated Title");
    });

    it("should accept publisher update", () => {
      const result = bookUpdateSchema.safeParse({ publisher: "New Pub" });
      expect(result.success).toBe(true);
      expect(result.data.publisher).toBe("New Pub");
    });

    it("should accept price update", () => {
      const result = bookUpdateSchema.safeParse({ price: 25.0 });
      expect(result.success).toBe(true);
      expect(result.data.price).toBe(25.0);
    });

    it("should accept multiple fields update", () => {
      const update = { title: "New Title", publisher: "New Pub", price: 20 };
      const result = bookUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("New Title");
      expect(result.data.publisher).toBe("New Pub");
      expect(result.data.price).toBe(20);
    });

    it("should reject empty object (refine validation)", () => {
      const result = bookUpdateSchema.safeParse({});
      expect(result.success).toBe(false);
      expect(result.error.flatten().formErrors?.[0]).toBe(
        "Pelo menos um campo é obrigatório"
      );
    });

    it("should reject if title is empty string", () => {
      const result = bookUpdateSchema.safeParse({ title: "   " });
      expect(result.success).toBe(false);
    });

    it("should allow title as optional", () => {
      const result = bookUpdateSchema.safeParse({ publisher: "Pub" });
      expect(result.success).toBe(true);
    });

    it("should reject extra fields", () => {
      const result = bookUpdateSchema.safeParse({
        title: "New",
        extraField: "bad",
      });
      expect(result.success).toBe(false);
    });

    it("should trim title in update", () => {
      const result = bookUpdateSchema.safeParse({ title: "  Trimmed  " });
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("Trimmed");
    });
  });
});

describe("Validation Schemas - AuthorSchema", () => {
  describe("authorCreateSchema", () => {
    it("should accept valid author with name only", () => {
      const result = authorCreateSchema.safeParse({ name: "Machado de Assis" });
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Machado de Assis");
    });

    it("should accept author with name and nationality", () => {
      const author = {
        name: "Clarice Lispector",
        nationality: "Brasileira",
      };
      const result = authorCreateSchema.safeParse(author);
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Clarice Lispector");
      expect(result.data.nationality).toBe("Brasileira");
    });

    it("should trim name whitespace", () => {
      const result = authorCreateSchema.safeParse({ name: "  Paulo Coelho  " });
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Paulo Coelho");
    });

    it("should reject empty name string", () => {
      const result = authorCreateSchema.safeParse({ name: "   " });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.name?.[0]).toBe(
        "Nome é obrigatório"
      );
    });

    it("should reject missing name", () => {
      const result = authorCreateSchema.safeParse({
        nationality: "Brasileira",
      });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    });

    it("should reject non-string name", () => {
      const result = authorCreateSchema.safeParse({ name: 123 });
      expect(result.success).toBe(false);
    });

    it("should reject extra fields (strict mode)", () => {
      const result = authorCreateSchema.safeParse({
        name: "Author",
        extraField: "should not be here",
      });
      expect(result.success).toBe(false);
    });

    it("should accept optional nationality", () => {
      const result = authorCreateSchema.safeParse({
        name: "Author",
        nationality: "Americana",
      });
      expect(result.success).toBe(true);
      expect(result.data.nationality).toBe("Americana");
    });

    it("should reject non-string nationality", () => {
      const result = authorCreateSchema.safeParse({
        name: "Author",
        nationality: 123,
      });
      expect(result.success).toBe(false);
    });

    it("should reject NoSQL injection in name", () => {
      const result = authorCreateSchema.safeParse({
        name: { $gt: "" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("authorUpdateSchema", () => {
    it("should accept name update", () => {
      const result = authorUpdateSchema.safeParse({ name: "Updated Name" });
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Updated Name");
    });

    it("should accept nationality update", () => {
      const result = authorUpdateSchema.safeParse({
        nationality: "Portuguesa",
      });
      expect(result.success).toBe(true);
      expect(result.data.nationality).toBe("Portuguesa");
    });

    it("should accept both name and nationality update", () => {
      const update = { name: "New Name", nationality: "Australiana" };
      const result = authorUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("New Name");
      expect(result.data.nationality).toBe("Australiana");
    });

    it("should reject empty object (refine validation)", () => {
      const result = authorUpdateSchema.safeParse({});
      expect(result.success).toBe(false);
      expect(result.error.flatten().formErrors?.[0]).toBe(
        "Pelo menos um campo é obrigatório"
      );
    });

    it("should reject if name is empty string", () => {
      const result = authorUpdateSchema.safeParse({ name: "   " });
      expect(result.success).toBe(false);
    });

    it("should allow name as optional", () => {
      const result = authorUpdateSchema.safeParse({
        nationality: "Portuguesa",
      });
      expect(result.success).toBe(true);
    });

    it("should reject extra fields", () => {
      const result = authorUpdateSchema.safeParse({
        name: "New",
        extraField: "bad",
      });
      expect(result.success).toBe(false);
    });

    it("should trim name in update", () => {
      const result = authorUpdateSchema.safeParse({ name: "  Trimmed  " });
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Trimmed");
    });
  });
});
