/* eslint-disable no-console */
import { beforeAll, afterAll } from "vitest";

beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = "test";
  if (process.env.MONGODB_DATABASE) {
    process.env.MONGODB_DATABASE = `${process.env.MONGODB_DATABASE}_test`;
  }
  console.log(
    `✓ Test environment configured with database: ${process.env.MONGODB_DATABASE}`
  );
});

afterAll(() => {
  // Cleanup if needed
});
