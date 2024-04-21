import { Metadata } from 'next';
import { RegisterForm } from './components/register-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col m-auto p-4 sm:w-[350px] h-screen justify-center">
      <div className="flex flex-col text-start">
        <h1 className="text-2xl font-semibold tracking-tight">
          Get started with qbick
        </h1>
        <p className="mt-3 mb-8 text-sm text-muted-foreground">
          Unlock the power of informed investing and stay ahead of market
          trends.
        </p>
        <RegisterForm />
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 text-primary"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
