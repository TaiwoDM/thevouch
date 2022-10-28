import { Publisher, Subjects, VoucherUpdatedEvent } from '@gethomes/common';

export class VoucherUpdatedPublisher extends Publisher<VoucherUpdatedEvent> {
  subject: Subjects.VoucherUpdated = Subjects.VoucherUpdated;
}
