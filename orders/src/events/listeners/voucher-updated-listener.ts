import { Message } from 'node-nats-streaming';
import { Subjects, Listener, VoucherUpdatedEvent } from '@gethomes/common';
import { Voucher } from '../../model/voucher';
import { queueGroupName } from './queue-group-name';

export class VoucherUpdatedListener extends Listener<VoucherUpdatedEvent> {
  subject: Subjects.VoucherUpdated = Subjects.VoucherUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: VoucherUpdatedEvent['data'], msg: Message) {
    const voucher = await Voucher.findByEvent(data);

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    const { product, price } = data;
    voucher.set({ product, price });
    await voucher.save();

    msg.ack();
  }
}
