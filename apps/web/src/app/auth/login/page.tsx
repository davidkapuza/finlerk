import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './components/login-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: '...',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col h-full justify-center m-auto sm:w-[350px]">
      <div className="flex flex-col mb-10 space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/auth/registration"
            className="underline underline-offset-4 text-primary"
          >
            Create account
          </Link>{' '}
          or login to get started.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
