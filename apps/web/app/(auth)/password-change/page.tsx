import { cn } from '@/shared/utils';
import { PasswordChangeForm } from '@/widgets/password-change-form';
import { Icons } from '@finlerk/lucide-react-icons';
import { buttonVariants } from '@finlerk/shadcn-ui';
import Link from 'next/link';

export default function PasswordChangePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  return (
    <>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-8 top-8 z-50',
        )}
      >
        <>
          <Icons.chevronLeft className="w-4 h-4 mr-2" />
          Back
        </>
      </Link>
      <div className="flex flex-col m-auto p-4 sm:w-[350px] justify-center h-screen">
        <div className="flex flex-col mb-8 space-y-3 text-start">
          <h1 className="text-2xl font-semibold tracking-tight">
            Password change
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter a new password below.
          </p>
        </div>
        <PasswordChangeForm hash={searchParams.hash} />
      </div>
    </>
  );
}
