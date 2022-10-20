import mongoose from 'mongoose';

interface HomeAttributes {
  title: string;
  price: number;
}

interface HomeModel extends mongoose.Model<HomeDoc> {
  build(homeAttributes: HomeAttributes): HomeDoc;
}

export interface HomeDoc extends mongoose.Document {
  title: string;
  price: number;
}

const homeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
