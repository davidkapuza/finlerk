import { Metadata } from 'next';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserAuthForm } from '../components/user-auth-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: '...',
};

export default function LoginPage() {
  return (
    <>
      <Link
        href="/auth/register"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8',
        )}
      >
        Register
      </Link>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
