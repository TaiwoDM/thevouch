import { Publisher, Subjects, HomeCreatedEvent } from '@gethomes/common';

export class HomeCreatedPublisher extends Publisher<HomeCreatedEvent> {
  subject: Subjects.HomeCreated = Subjects.HomeCreated;
}
