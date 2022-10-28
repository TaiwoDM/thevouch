import { Message } from 'node-nats-streaming';
import { Subjects, Listener, VoucherCreatedEvent } from '@gethomes/common';
import { Voucher } from '../../model/voucher';
import { queueGroupName } from './queue-group-name';

export class VoucherCreatedListener extends Listener<VoucherCreatedEvent> {
  subject: Subjects.VoucherCreated = Subjects.VoucherCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: VoucherCreatedEvent['data'], msg: Message) {
    const { id, product, price } = data;

    const voucher = Voucher.build({
      id,
      product,
      price,
    });
    await voucher.save();

    msg.ack();
  }
}
