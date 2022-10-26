import { Listener, OrderCancelledEvent, Subjects } from '@gethomes/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Home } from './../../models/home';
import { HomeUpdatedPublisher } from '../publishers/home-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const home = await Home.findById(data.home.id);

    if (!home) {
      throw new Error('Home not found');
    }

    home.set({ orderId: undefined });
    await home.save();
    await new HomeUpdatedPublisher(this.client).publish({
      id: home.id,
      version: home.version,
      product: home.product,
      productPrice: home.productPrice,
      description: home.description,
      percentageOff: home.percentageOff,
      price: home.price,
      userId: home.userId,
      orderId: home.orderId,
    });

    msg.ack();
  }
}
