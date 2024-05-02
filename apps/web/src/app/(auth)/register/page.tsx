import { Metadata } from 'next';
import { RegisterForm } from './ui/register-form';
import Link from 'next/link';
import { authApi } from '../lib/api/auth.api';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

async function getGoogleLoginUrl(): Promise<string> {
  return await authApi.getGoogleLoginUrl();
}

export default async function RegisterPage() {
  const googleLoginUrl = await getGoogleLoginUrl();

  return (
    <div className="flex flex-col m-auto p-4 sm:w-[350px] h-screen justify-center">
      <div className="flex flex-col text-start">
        <h1 className="text-2xl font-semibold tracking-tight">
          Get started with finlerk
        </h1>
        <p className="mt-3 mb-8 text-sm text-muted-foreground">
          Unlock the power of informed investing and stay ahead of market
          trends.
        </p>
        <RegisterForm googleLoginUrl={googleLoginUrl} />
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
