import { User } from './user';

export class Session {
  id: number;
  user: User;
  sessionToken: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
