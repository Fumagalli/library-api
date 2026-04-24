/* eslint-disable no-console */
import { beforeAll, afterAll } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  // In CI with fake credentials, use MongoDB Memory Server
  const isCIEnvironment = process.env.CI === "true";
  const hasTestCredentials =
    process.env.MONGODB_USER === "test_user" ||
    process.env.MONGODB_PASSWORD === "test_password";

  if (isCIEnvironment || hasTestCredentials) {
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      process.env.MONGODB_URI = uri;
      process.env.NODE_ENV = "test";
      console.log("✓ MongoDB Memory Server started for CI");
    } catch (error) {
      console.error("✗ MongoDB Memory Server failed in CI:", error.message);
      throw error;
    }
  } else {
    // Local development: use real MongoDB with _test suffix for safety
    process.env.NODE_ENV = "test";
    if (
      process.env.MONGODB_DATABASE &&
      !process.env.MONGODB_DATABASE.includes("test")
    ) {
      process.env.MONGODB_DATABASE = `${process.env.MONGODB_DATABASE}_test`;
    }
    console.log(`✓ Test environment: using real MongoDB with database suffix`);
  }
});

afterAll(async () => {
  try {
    if (mongoServer) {
      await mongoServer.stop();
      console.log("✓ MongoDB Memory Server stopped");
    }
  } catch (error) {
    console.warn("⚠ Failed to stop MongoDB Memory Server:", error.message);
  }
});
