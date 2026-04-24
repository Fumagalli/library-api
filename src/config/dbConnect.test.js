import { describe, it, expect } from "vitest";

describe("dbConnect.js - Environment Variables Validation", () => {
  it("should throw error when required environment variables are missing", async () => {
    // Mock process.env to simulate missing variables
    const originalEnv = { ...process.env };
    delete process.env.MONGODB_USER;

    try {
      const { default: connectDataBase } = await import("./dbConnect.js");
      await expect(connectDataBase()).rejects.toThrow(
        /Missing required environment variables/
      );
    } finally {
      // Restore original environment
      process.env.MONGODB_USER = originalEnv.MONGODB_USER;
    }
  });
});
