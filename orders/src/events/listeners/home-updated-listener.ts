import { Message } from 'node-nats-streaming';
import { Subjects, Listener, HomeUpdatedEvent } from '@gethomes/common';
import { Home } from './../../model/home';
import { queueGroupName } from './queue-group-name';

export class HomeUpdatedListener extends Listener<HomeUpdatedEvent> {
  subject: Subjects.HomeUpdated = Subjects.HomeUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: HomeUpdatedEvent['data'], msg: Message) {
    const home = await Home.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!home) {
      throw new Error('Home not found');
    }

    const { title, price } = data;
    home.set({ title, price });
    await home.save();

    msg.ack();
  }
}
