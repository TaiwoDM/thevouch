import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface HomeAttributes {
  product: string;
  productPrice: number;
  description: string;
  price: number;
  percentageOff: number;
  userId: string;
}

interface HomeModel extends mongoose.Model<HomeDoc> {
  build(homeAttributes: HomeAttributes): HomeDoc;
}

interface HomeDoc extends mongoose.Document {
  product: string;
  productPrice: number;
  description: string;
  price: number;
  percentageOff: number;
  userId: string;
  version: number;
  orderId?: string;
}

const homeSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    percentageOff: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

homeSchema.set('versionKey', 'version');
homeSchema.plugin(updateIfCurrentPlugin);

homeSchema.statics.build = function (homeAttributes: HomeAttributes) {
  return new Home(homeAttributes);
};

const Home = mongoose.model<HomeDoc, HomeModel>('Home', homeSchema);

export { Home };
