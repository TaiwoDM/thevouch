import mongoose from 'mongoose';

import { app } from './app';

// connect to db
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb');
  } catch (err) {
    console.log('something went wrong while connecting to db');
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
};

start();
