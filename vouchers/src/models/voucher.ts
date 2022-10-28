import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface VoucherAttributes {
  product: string;
  productPrice: number;
  description: string;
  price: number;
  percentageOff: number;
  userId: string;
  createdAt: Date;
}

interface VoucherModel extends mongoose.Model<VoucherDoc> {
  build(voucherAttributes: VoucherAttributes): VoucherDoc;
}

interface VoucherDoc extends mongoose.Document {
  product: string;
  productPrice: number;
  description: string;
  price: number;
  percentageOff: number;
  userId: string;
  version: number;
  orderId?: string;
  createdAt: Date;
}

const voucherSchema = new mongoose.Schema(
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
    createdAt: {
      type: Date,
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

voucherSchema.set('versionKey', 'version');
voucherSchema.plugin(updateIfCurrentPlugin);

voucherSchema.statics.build = function (voucherAttributes: VoucherAttributes) {
  return new Voucher(voucherAttributes);
};

const Voucher = mongoose.model<VoucherDoc, VoucherModel>(
  'Voucher',
  voucherSchema
);

export { Voucher };
