import { Subjects, Publisher, PaymentCreatedEvent } from '@gethomes/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
