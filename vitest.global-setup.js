/* eslint-disable no-console */
import "dotenv/config.js";

export async function setup() {
  process.env.NODE_ENV = "test";

  // If MONGODB_URI is set (CI with Docker), use it
  if (process.env.MONGODB_URI) {
    console.log("✓ Using MONGODB_URI (Docker/CI environment)");
    return;
  }

  // Local development: use .env credentials
  if (process.env.MONGODB_USER && process.env.MONGODB_CLUSTER) {
    console.log("✓ Using .env credentials (local development)");
    return;
  }

  throw new Error(
    "Missing database configuration. " +
      "Provide MONGODB_URI or .env with MongoDB credentials."
  );
}

export async function teardown() {
  // No cleanup needed
}
