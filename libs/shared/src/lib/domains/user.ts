export class User {
  id: number;
  email: string | null;
  name: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
