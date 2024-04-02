export type RegisterRequestType = Readonly<{
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}>;
