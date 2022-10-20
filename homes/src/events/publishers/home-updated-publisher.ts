import { Publisher, Subjects, HomeUpdatedEvent } from '@gethomes/common';

export class HomeUpdatedPublisher extends Publisher<HomeUpdatedEvent> {
  subject: Subjects.HomeUpdated = Subjects.HomeUpdated;
}
