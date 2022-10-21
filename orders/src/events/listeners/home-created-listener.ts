import { Message } from 'node-nats-streaming';
import { Subjects, Listener, HomeCreatedEvent } from '@gethomes/common';
import { Home } from './../../model/home';
import { queueGroupName } from './queue-group-name';

export class HomeCreatedListener extends Listener<HomeCreatedEvent> {
  subject: Subjects.HomeCreated = Subjects.HomeCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: HomeCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const home = Home.build({
      id,
      title,
      price,
    });
    await home.save();

    msg.ack();
  }
}
