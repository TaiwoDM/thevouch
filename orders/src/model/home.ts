import mongoose from 'mongoose';

import { Order, OrderStatus } from './order';

interface HomeAttributes {
  id: string;
  title: string;
  price: number;
}

interface HomeModel extends mongoose.Model<HomeDoc> {
  build(homeAttributes: HomeAttributes): HomeDoc;
}

export interface HomeDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
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
      },
    },
  }
);

homeSchema.statics.build = function (homeAttributes: HomeAttributes) {
  return new Home({
    _id: homeAttributes.id,
    title: homeAttributes.title,
    price: homeAttributes.price,
  });
};

// Run query to look at all orders.  Find an order where the home
// is the home we just found *and* the orders status is *not* cancelled.
// If we find an order from that means the home *is* reserved
homeSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    home: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Home = mongoose.model<HomeDoc, HomeModel>('Home', homeSchema);

export { Home };
