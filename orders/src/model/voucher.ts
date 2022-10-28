import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order, OrderStatus } from './order';

interface VoucherAttributes {
  id: string;
  product: string;
  price: number;
}

interface VoucherModel extends mongoose.Model<VoucherDoc> {
  build(voucherAttributes: VoucherAttributes): VoucherDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<VoucherDoc | null>;
}

export interface VoucherDoc extends mongoose.Document {
  version: number;
  product: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const voucherSchema = new mongoose.Schema(
  {
    product: {
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

voucherSchema.set('versionKey', 'version');
voucherSchema.plugin(updateIfCurrentPlugin);

voucherSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  const voucher = await Voucher.findOne({
    _id: event.id,
    version: event.version - 1,
  });

  return voucher;
};

voucherSchema.statics.build = (voucherAttributes: VoucherAttributes) => {
  return new Voucher({
    _id: voucherAttributes.id,
    product: voucherAttributes.product,
    price: voucherAttributes.price,
  });
};

// Run query to look at all orders.  Find an order where the vouhcer
// is the vouhcer we just found *and* the orders status is *not* cancelled.
// If we find an order from that means the vouhcer *is* reserved
voucherSchema.methods.isReserved = async function () {
  // this === the vouhcer document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    voucher: this as any,
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

const Voucher = mongoose.model<VoucherDoc, VoucherModel>(
  'Voucher',
  voucherSchema
);

export { Voucher };
