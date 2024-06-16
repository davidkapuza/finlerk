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
import { AuthResetPasswordDto } from '@finlerk/shared';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/auth.api';
import { HttpResponseError } from '../errors';

const resolver = classValidatorResolver(AuthResetPasswordDto);

type PasswordChangeFormProps = {
  hash: string;
};

export function PasswordChangeForm({ hash }: PasswordChangeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<AuthResetPasswordDto>({
    resolver,
    defaultValues: {
      password: '',
      hash,
    },
  });

  const { setError } = form;

  React.useEffect(() => {
    if (!hash) {
      toast({
        variant: 'destructive',
        title: 'Unknown exception occured.',
      });
      router.push('/login');
    }
  }, [hash, router, toast]);

  async function onSubmit(values: AuthResetPasswordDto) {
    try {
      setIsLoading(true);
      await authApi.resetPassword(values);
      toast({
        title: 'Password has been successfully changed',
        description: 'Try to log in again with a new password.',
      });
      router.push('/login');
    } catch (error) {
      if (error instanceof HttpResponseError) {
        if (error.data.errors.password) {
          setError('password', {
            message: error.data.errors.password,
          });
        } else if (error.data.errors.hash) {
          toast({
            variant: 'destructive',
            title: error.message,
            description: error.data.errors.hash,
          });
        } else {
          toast({
            variant: 'destructive',
            title: error.message,
            description: error.statusText,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
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
              'Save'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
