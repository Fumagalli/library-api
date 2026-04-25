import mongoose from "mongoose";

async function connectDataBase() {
  let mongoUri;

  if (process.env.MONGODB_URI) {
    // Use memory server URI in CI or when explicitly provided
    mongoUri = process.env.MONGODB_URI;
  } else {
    // Use Atlas cluster in production/local
    const requiredVars = [
      "MONGODB_USER",
      "MONGODB_PASSWORD",
      "MONGODB_CLUSTER",
      "MONGODB_DATABASE",
    ];

    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }

    const encodedPassword = encodeURIComponent(process.env.MONGODB_PASSWORD);
    mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${encodedPassword}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?appName=FumaloneTestCluster`;
  }

  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

export default connectDataBase;
