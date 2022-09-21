import mongoose from 'mongoose';

import { Password } from './../services/password';

// interface describing props needed to create user
interface UserAttributes {
  email: string;
  password: string;
}

// interface describing the methods that the user model has to have
interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttributes: UserAttributes): UserDoc;
}

// interface describing the properties of a user document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = function (userAttributes: UserAttributes) {
  return new User(userAttributes);
};

// pre save middleware to encrypt password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.password);
    this.set('password', hashedPassword);
  }

  next();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
