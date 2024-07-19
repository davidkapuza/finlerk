'use client';
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
} from '@finlerk/shadcn-ui';
import { AuthEmailLoginDto } from '@finlerk/shared';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { signIn } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { OAuthProviders } from '../../entities/auth/ui/oauth-providers';
import { PasswordResetDialog } from '../../features/auth/password-reset/password-reset.ui';

const resolver = classValidatorResolver(AuthEmailLoginDto);

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<AuthEmailLoginDto>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: AuthEmailLoginDto) {
    setIsLoading(true);
    // TODO Improve handling of invalid credentials, displaying errors returned from login endpoint under inputs
    await signIn('credentials', {
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
          <Button className="w-full" type="submit" disabled={isLoading}>
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
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <OAuthProviders />
          </div>
        </form>
      </Form>
      <PasswordResetDialog />
    </>
  );
}
