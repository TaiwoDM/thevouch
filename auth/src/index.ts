import mongoose from 'mongoose';

import { app } from './app';

// connect to db
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    const connect = await mongoose.connect(
      'mongodb://auth-mongo-srv:27017/auth'
    );
    console.log('Connected to mongodb');
  } catch (err) {
    console.log('something went wrong while connecting to db');
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
};

start();
