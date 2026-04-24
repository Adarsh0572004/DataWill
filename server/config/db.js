import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  Could not connect to MongoDB at ${process.env.MONGO_URI}`);
    console.log('   Starting in-memory MongoDB for development...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`✅ In-memory MongoDB started at ${uri}`);
      console.log('   ⚠️  Data will NOT persist between server restarts.');
    } catch (memError) {
      console.error(`❌ Failed to start in-memory MongoDB: ${memError.message}`);
      console.error('   Install MongoDB locally or set MONGO_URI to a MongoDB Atlas connection string.');
    }
  }
};

export default connectDB;
