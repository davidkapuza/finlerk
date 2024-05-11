'use client';

import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Icons } from '@finlerk/lucide-react-icons';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from '@finlerk/shadcn-ui';
import { RegisterDto, RegisterRequestType } from '@finlerk/shared';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../lib/api/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';

const resolver = classValidatorResolver(RegisterDto);

export function RegisterForm({ googleLoginUrl }: { googleLoginUrl: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<RegisterRequestType>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  function onSubmit(values: RegisterRequestType) {
    setIsLoading(true);
    authApi
      .register(values)
      .then(() => {
        toast({
          title: 'Check your email',
          description:
            'We sent you a login link. Be sure to check your spam too.',
        });
      })
      .finally(() => setIsLoading(false));
  }

  function onGoogleLogin() {
    setIsLoading(true);
    window.location.replace(googleLoginUrl);
  }

  React.useEffect(() => {
    if (code) {
      setIsLoading(true);
      authApi
        .googleLogin({ code })
        .then(() => router.push('/news'))
        .finally(() => setIsLoading(false));
    }
  }, [code, router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex flex-row gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    type="firstName"
                    placeholder="Jhon"
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    type="lastName"
                    placeholder="Doe"
                    autoComplete="family-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Password must be at least 6 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>Make sure passwords match</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          {isLoading ? (
            <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            disabled={isLoading}
            onClick={onGoogleLogin}
          >
            <Icons.google className="w-4 h-4 mr-2" />
            Google
          </Button>
        </div>
      </form>
    </Form>
  );
}
