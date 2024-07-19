import Link from 'next/link';
import { LoginForm } from '@/widgets/login-form';

export default async function LoginPage() {
  return (
    <div className="flex flex-col m-auto p-4 sm:w-[350px] justify-center h-screen">
      <div className="flex flex-col mb-8 space-y-3 text-start">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to finlerk
        </h1>
        <p className="text-sm text-muted-foreground">
          Seize opportunities and navigate market fluctuations effortlessly.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-muted-foreground">
        Don&apos;t have account?{' '}
        <Link
          href="/register"
          className="font-medium hover:underline underline-offset-4 text-primary"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
