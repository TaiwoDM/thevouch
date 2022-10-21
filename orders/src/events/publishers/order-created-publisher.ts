import { Publisher, OrderCreatedEvent, Subjects } from '@gethomes/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
