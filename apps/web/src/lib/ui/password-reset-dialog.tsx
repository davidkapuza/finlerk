'use client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@finlerk/shadcn-ui';
import { AuthForgotPasswordDto } from '@finlerk/shared';
import React from 'react';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Icons } from '@finlerk/lucide-react-icons';
import { authApi } from '../api/auth.api';
import { HttpResponseError } from '../errors';

const resolver = classValidatorResolver(AuthForgotPasswordDto);

export function PasswordResetDialog() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AuthForgotPasswordDto>({
    resolver,
    defaultValues: {
      email: '',
    },
  });

  const { setError } = form;

  async function onSubmit(values: AuthForgotPasswordDto) {
    try {
      setIsLoading(true);
      await authApi.forgotPassword(values);
      toast({
        title: 'Check your email',
        description: `Email with password reset has been sent to: ${values.email}`,
      });
    } catch (error) {
      if (error instanceof HttpResponseError) {
        if (error.data) {
          setError('email', {
            message: error.data.errors.email,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="justify-start px-0 mt-2">
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Password reset</DialogTitle>
          <DialogDescription>
            Please, enter your e-mail address below to recieve a password reset
            email.
          </DialogDescription>
        </DialogHeader>
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
            <DialogFooter>
              <Button
                type="submit"
                className="w-full mt-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  'Send reset email'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
