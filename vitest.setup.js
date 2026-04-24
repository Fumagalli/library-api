import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

// Start MongoDB Memory Server before all tests
export async function setupMongoDB() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Set environment to use the in-memory MongoDB
  process.env.MONGODB_URI = mongoUri;
  process.env.MONGODB_USER = "test";
  process.env.MONGODB_PASSWORD = "test";
  process.env.MONGODB_CLUSTER = mongoUri;
  process.env.MONGODB_DATABASE = "test_db";
}

// Stop MongoDB Memory Server after all tests
export async function teardownMongoDB() {
  if (mongoServer) {
    await mongoServer.stop();
  }
}

// Setup on module load
await setupMongoDB();

// Cleanup on process exit
process.on("exit", async () => {
  await teardownMongoDB();
});
