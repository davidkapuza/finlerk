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
  useToast,
} from '@finlerk/shadcn-ui';
import { AuthRegisterLoginDto } from '@finlerk/shared';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import React from 'react';
import { useForm } from 'react-hook-form';
import { OAuthProviders } from '../../entities/auth/ui/oauth-providers';
import { authApi } from '@/entities/auth';
import { isHttpError } from '@/shared/lib/fetch';
import { apiLib } from '@/shared/api';

const resolver = classValidatorResolver(AuthRegisterLoginDto);

// TODO Provide resend email UI

export function RegisterForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<AuthRegisterLoginDto>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  async function onSubmit(values: AuthRegisterLoginDto) {
    setIsLoading(true);
    try {
      await authApi.credentialsRegistration({
        credentials: values,
      });
      toast({
        title: 'Check your email',
        description: `To start using finlerk, confirm your email address with the email we sent to: ${values.email}`,
      });
    } catch (error) {
      if (isHttpError(error)) {
        apiLib.setFormErrors(form)(error.response);
      } else {
        // TODO
      }
    } finally {
      setIsLoading(false);
    }
  }

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
          <OAuthProviders />
        </div>
      </form>
    </Form>
  );
}
