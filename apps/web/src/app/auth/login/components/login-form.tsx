'use client';
import { Api } from '@/lib/api';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Icons } from '@qbick/lucide-react-icons';
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
} from '@qbick/shadcn-ui';
import { EmailLoginDto, LoginRequestType } from '@qbick/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../lib/api/auth.api';

const resolver = classValidatorResolver(EmailLoginDto);

export function LoginForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<LoginRequestType>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setError } = form;

  function onSubmit(values: LoginRequestType) {
    setIsLoading(true);
    authApi
      .login(values)
      .then(() => router.push('/'))
      .catch((error) => Api.error(error, setError))
      .finally(() => setIsLoading(false));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  autoComplete="username"
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
                Password must be at least 8 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link
          href="#"
          className="inline-block w-full text-sm underline text-end underline-offset-4 hover:text-primary"
        >
          Forgot password?
        </Link>
        <Button className="w-full" type="submit">
          {isLoading ? (
            <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            'Login'
          )}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          disabled={isLoading}
        >
          <Icons.google className="w-4 h-4 mr-2" />
          Google
        </Button>
      </form>
    </Form>
  );
}
