import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const mongoURI = process.env.DB_URL;

export const connectDB = async () => {
  if (!mongoURI) {
    throw new Error('MongoDB URL is missing in environment variables');
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message || error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.error('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
