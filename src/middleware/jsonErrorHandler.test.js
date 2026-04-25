import { describe, it, expect, vi, beforeEach } from "vitest";
import { jsonErrorHandler } from "./jsonErrorHandler.js";

describe("jsonErrorHandler middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  it("should handle SyntaxError with status 400 for invalid JSON", () => {
    const syntaxError = new SyntaxError("Unexpected token");
    syntaxError.status = 400;
    syntaxError.body = true; // Mark that it has body property

    jsonErrorHandler(syntaxError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Invalid JSON body",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should pass generic errors to next middleware", () => {
    const genericError = new Error("Database error");

    jsonErrorHandler(genericError, mockReq, mockRes, mockNext);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(genericError);
  });

  it("should pass SyntaxError without status 400 to next middleware", () => {
    const syntaxError = new SyntaxError("Invalid token");
    syntaxError.status = 500;

    jsonErrorHandler(syntaxError, mockReq, mockRes, mockNext);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(syntaxError);
  });

  it("should pass SyntaxError without body property to next middleware", () => {
    const syntaxError = new SyntaxError("Unexpected token");
    syntaxError.status = 400;
    // No body property

    jsonErrorHandler(syntaxError, mockReq, mockRes, mockNext);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(syntaxError);
  });
});
