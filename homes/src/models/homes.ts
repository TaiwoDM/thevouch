import mongoose from 'mongoose';

interface HomeAttributes {
  description: string;
  price: number;
  picture: string;
  userId: string;
}

interface HomeModel extends mongoose.Model<HomeDoc> {
  build(homeAttributes: HomeAttributes): HomeDoc;
}

interface HomeDoc extends mongoose.Document {
  description: string;
  price: number;
  picture: string;
  userId: string;
}

const homeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

homeSchema.statics.build = function (homeAttributes: HomeAttributes) {
  return new Home(homeAttributes);
};

const Home = mongoose.model<HomeDoc, HomeModel>('Home', homeSchema);

export { Home };
