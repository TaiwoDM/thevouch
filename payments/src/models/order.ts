import { OrderStatus } from '@gethomes/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttributes {
  id: string;
  version: number;
  price: number;
  status: OrderStatus;
  userId: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderAttributes: OrderAttributes): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  price: number;
  status: OrderStatus;
  userId: string;
}

const orderSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = function (orderAttributes: OrderAttributes) {
  return new Order({
    _id: orderAttributes.id,
    version: orderAttributes.version,
    userId: orderAttributes.userId,
    status: orderAttributes.status,
    price: orderAttributes.price,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
