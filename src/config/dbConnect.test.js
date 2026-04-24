import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import mongoose from "mongoose";

describe("dbConnect.js - Environment Variables Validation", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it("should throw error when required environment variables are missing", async () => {
    delete process.env.MONGODB_USER;
    delete process.env.MONGODB_URI;

    const { default: connectDataBase } = await import("./dbConnect.js");
    await expect(connectDataBase()).rejects.toThrow(
      /Missing required environment variables/
    );
  });

  it("should use MONGODB_URI when provided (CI environment)", async () => {
    // Simulate CI environment with Memory Server URI
    const testUri = "mongodb://localhost:27017/test_db";
    process.env.MONGODB_URI = testUri;
    process.env.MONGODB_USER = undefined;

    // Mock mongoose.connect to verify it's called with the URI
    const connectSpy = vi.spyOn(mongoose, "connect").mockResolvedValueOnce({
      on: () => {},
      once: () => {},
    });

    const { default: connectDataBase } = await import("./dbConnect.js");
    await connectDataBase();

    expect(connectSpy).toHaveBeenCalledWith(testUri);
    connectSpy.mockRestore();
  });
});
