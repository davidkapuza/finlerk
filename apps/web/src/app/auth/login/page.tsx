import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './components/login-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: '...',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col m-auto p-4 sm:w-[350px]">
      <div className="flex flex-col mb-8 space-y-3 text-start">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to qbick
        </h1>
        <p className="text-sm text-muted-foreground">
          Seize opportunities and navigate market fluctuations effortlessly.
        </p>
      </div>
      <LoginForm />
      <Link href="#" className="mt-6 mb-4 text-sm">
        Forgot password?
      </Link>
      <p className="text-sm text-muted-foreground">
        Don&apos;t have account?{' '}
        <Link href="/auth/registration" className="text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
