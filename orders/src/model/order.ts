import mongoose from 'mongoose';
import { OrderStatus } from '@gethomes/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

import { VoucherDoc } from './voucher';

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  voucher: VoucherDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderAttributes: OrderAttributes): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  voucher: VoucherDoc;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher',
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
  return new Order(orderAttributes);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
