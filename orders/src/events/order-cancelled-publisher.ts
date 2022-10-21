import { Subjects, Publisher, OrderCancelledEvent } from '@gethomes/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
