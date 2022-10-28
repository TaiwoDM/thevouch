import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@gethomes/common';
import { queueGroupName } from './queue-group-name';

import { Voucher } from '../../models/voucher';
import { VoucherUpdatedPublisher } from '../publishers/voucher-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the voucher that the order is reserving
    const voucher = await Voucher.findById(data.voucher.id);

    // If no voucher, throw error
    if (!voucher) {
      throw new Error('Voucher not found');
    }

    // Mark the voucher as being reserved by setting its orderId property
    voucher.set({ orderId: data.id });

    // Save the voucher
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

    // ack the message
    msg.ack();
  }
}
