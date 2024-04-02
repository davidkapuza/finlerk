import { Metadata } from 'next';
import { RegistrationForm } from './components/registration-form';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function RegistrationPage() {
  return (
    <div className="flex flex-col m-auto p-4 sm:w-[350px]">
      <div className="flex flex-col mb-8 space-y-3 text-start">
        <h1 className="text-2xl font-semibold tracking-tight">
          Get started with qbick
        </h1>
        <p className="text-sm text-muted-foreground">
          Unlock the power of informed investing and stay ahead of market
          trends.
        </p>
        <RegistrationForm />
      </div>
    </div>
  );
}
