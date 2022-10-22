import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@gethomes/common';
import { queueGroupName } from './queue-group-name';

import { Home } from '../../models/home';
import { HomeUpdatedPublisher } from './../publishers/home-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the home that the order is reserving
    const home = await Home.findById(data.home.id);

    // If no home, throw error
    if (!home) {
      throw new Error('Home not found');
    }

    // Mark the home as being reserved by setting its orderId property
    home.set({ orderId: data.id });

    // Save the home
    await home.save();

    await new HomeUpdatedPublisher(this.client).publish({
      id: home.id,
      version: home.version,
      title: home.title,
      description: home.description,
      picture: home.picture,
      price: home.price,
      userId: home.userId,
      orderId: home.orderId,
    });

    // ack the message
    msg.ack();
  }
}
