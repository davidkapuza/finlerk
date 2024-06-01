import { User } from './user';

export class Account {
  id: number;
  user: User;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: string | null;
  id_token: string | null;
  scope: string | null;
  session_state: string | null;
  token_type: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
