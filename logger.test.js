import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import logger from "./src/utils/logger.js";

describe("Logger Utility", () => {
  let consoleErrorSpy;
  let consoleLogSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe("logger.error()", () => {
    it("should log Error object with message and stack", () => {
      const testError = new Error("Test error message");
      logger.error("testContext", testError);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[0]).toBe("[ERROR] testContext");
      expect(callArgs[1].message).toBe("Test error message");
      expect(callArgs[1].stack).toBeDefined();
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should log string error message", () => {
      logger.error("stringContext", "String error");

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].message).toBe("String error");
      expect(callArgs[1].stack).toBeUndefined();
    });

    it("should handle null error gracefully", () => {
      logger.error("nullContext", null);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].message).toBe("null");
      expect(callArgs[1].stack).toBeUndefined();
    });

    it("should handle undefined error gracefully", () => {
      logger.error("undefinedContext", undefined);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].message).toBe("undefined");
      expect(callArgs[1].stack).toBeUndefined();
    });

    it("should handle object with message property", () => {
      const errorObj = {
        message: "Object error",
        stack: "at line 10",
      };
      logger.error("objectContext", errorObj);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].message).toBe("Object error");
      expect(callArgs[1].stack).toBe("at line 10");
    });

    it("should handle object without message property", () => {
      const errorObj = { code: 500, reason: "Something" };
      logger.error("objectNoMessageContext", errorObj);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].message).toBe("[object Object]");
    });

    it("should handle number as error", () => {
      logger.error("numberContext", 500);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].message).toBe("500");
    });

    it("should include timestamp in error log", () => {
      logger.error("timestampContext", new Error("Test"));

      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);
    });

    it("should handle object with null stack", () => {
      const errorObj = {
        message: "Test message",
        stack: null,
      };
      logger.error("nullStackContext", errorObj);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].stack).toBeUndefined();
    });

    it("should handle object with non-string stack", () => {
      const errorObj = {
        message: "Test message",
        stack: 123,
      };
      logger.error("nonStringStackContext", errorObj);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1].stack).toBeUndefined();
    });
  });

  describe("logger.info()", () => {
    it("should log info message without data", () => {
      logger.info("Info message");

      expect(consoleLogSpy).toHaveBeenCalled();
      const callArgs = consoleLogSpy.mock.calls[0];
      expect(callArgs[0]).toBe("[INFO] Info message");
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should log info message with data object", () => {
      const data = { userId: 123, action: "login" };
      logger.info("User action", data);

      expect(consoleLogSpy).toHaveBeenCalled();
      const callArgs = consoleLogSpy.mock.calls[0];
      expect(callArgs[0]).toBe("[INFO] User action");
      expect(callArgs[1].userId).toBe(123);
      expect(callArgs[1].action).toBe("login");
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should merge data with timestamp", () => {
      logger.info("Test", { custom: "value" });

      const callArgs = consoleLogSpy.mock.calls[0];
      expect(callArgs[1].custom).toBe("value");
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should handle empty data object", () => {
      logger.info("Empty data", {});

      expect(consoleLogSpy).toHaveBeenCalled();
      const callArgs = consoleLogSpy.mock.calls[0];
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should include ISO timestamp format", () => {
      logger.info("Timestamp test");

      const callArgs = consoleLogSpy.mock.calls[0];
      expect(callArgs[1].timestamp).toMatch(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
    });
  });

  describe("logger.warn()", () => {
    it("should log warning message without data", () => {
      logger.warn("Warning message");

      expect(consoleWarnSpy).toHaveBeenCalled();
      const callArgs = consoleWarnSpy.mock.calls[0];
      expect(callArgs[0]).toBe("[WARN] Warning message");
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should log warning message with data object", () => {
      const data = { threshold: 90, current: 95 };
      logger.warn("High memory usage", data);

      expect(consoleWarnSpy).toHaveBeenCalled();
      const callArgs = consoleWarnSpy.mock.calls[0];
      expect(callArgs[0]).toBe("[WARN] High memory usage");
      expect(callArgs[1].threshold).toBe(90);
      expect(callArgs[1].current).toBe(95);
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should handle empty data object", () => {
      logger.warn("No data warning", {});

      expect(consoleWarnSpy).toHaveBeenCalled();
      const callArgs = consoleWarnSpy.mock.calls[0];
      expect(callArgs[1].timestamp).toBeDefined();
    });

    it("should merge data with timestamp", () => {
      logger.warn("Test warn", { category: "security" });

      const callArgs = consoleWarnSpy.mock.calls[0];
      expect(callArgs[1].category).toBe("security");
      expect(callArgs[1].timestamp).toBeDefined();
    });
  });

  describe("Timestamp format consistency", () => {
    it("should use ISO 8601 format for all log types", () => {
      const isoRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

      logger.error("error", new Error("Test"));
      logger.info("info");
      logger.warn("warn");

      expect(consoleErrorSpy.mock.calls[0][1].timestamp).toMatch(isoRegex);
      expect(consoleLogSpy.mock.calls[0][1].timestamp).toMatch(isoRegex);
      expect(consoleWarnSpy.mock.calls[0][1].timestamp).toMatch(isoRegex);
    });
  });
});
