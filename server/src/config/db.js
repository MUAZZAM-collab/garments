import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to configured MongoDB...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✨ MongoDB Connected: ${conn.connection.host}`);
      return;
    }

    console.log('No MONGODB_URI provided. Initializing in-memory MongoDB database...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      binary: {
        version: '6.0.14',
      },
    });
    const uri = memoryServer.getUri();
    
    const conn = await mongoose.connect(uri);
    console.log(`✨ Embedded MongoMemoryServer active at: ${uri}`);
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${error.message}). Attempting in-memory fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        binary: {
          version: '6.0.14',
        },
      });
      const uri = memoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✨ In-memory MongoDB Fallback Connected: ${uri}`);
    } catch (fallbackError) {
      console.error(`Database Connection Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
};


