import mongoose from "mongoose";

async function connectDataBase() {
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
  const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${encodedPassword}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?appName=FumaloneTestCluster`;

  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

export default connectDataBase;
