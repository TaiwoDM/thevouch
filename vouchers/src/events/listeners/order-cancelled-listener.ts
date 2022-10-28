import { Listener, OrderCancelledEvent, Subjects } from '@gethomes/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Voucher } from './../../models/voucher';
import { VoucherUpdatedPublisher } from '../publishers/voucher-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const voucher = await Voucher.findById(data.voucher.id);

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    voucher.set({ orderId: undefined });
    await voucher.save();
    await new VoucherUpdatedPublisher(this.client).publish({
      id: voucher.id,
      version: voucher.version,
      product: voucher.product,
      productPrice: voucher.productPrice,
      description: voucher.description,
      percentageOff: voucher.percentageOff,
      price: voucher.price,
      userId: voucher.userId,
      orderId: voucher.orderId,
    });

    msg.ack();
  }
}
