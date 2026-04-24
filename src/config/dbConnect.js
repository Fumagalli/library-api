import mongoose from "mongoose";

async function connectDataBase() {
  const encodedPassword = encodeURIComponent(process.env.MONGODB_PASSWORD);
  const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${encodedPassword}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?appName=FumaloneTestCluster`;

  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

export default connectDataBase;
