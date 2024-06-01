import { LoginForm } from './ui/login-form';

export default async function LoginPage() {
  return (
    <div className="flex flex-col m-auto px-4 sm:w-[350px] justify-center text-center h-screen">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
      <p className="pt-3 pb-6 text-sm text-muted-foreground">
        Seize opportunities and navigate market fluctuations effortlessly.
      </p>
      <LoginForm />
    </div>
  );
}
