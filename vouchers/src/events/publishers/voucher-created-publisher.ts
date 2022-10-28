import { Publisher, Subjects, VoucherCreatedEvent } from '@gethomes/common';

export class VoucherCreatedPublisher extends Publisher<VoucherCreatedEvent> {
  subject: Subjects.VoucherCreated = Subjects.VoucherCreated;
}
