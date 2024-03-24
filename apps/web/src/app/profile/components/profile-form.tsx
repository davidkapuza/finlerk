'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Input,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@qbick/shadcn-ui';
import { ReloadIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { Button } from 'react-day-picker';
import { Form, useForm } from 'react-hook-form';
import * as z from 'zod';
import api from '../../../lib/api';

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const defaultValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    api
      .patch('/api/v1/users/my-profile', {
        ...data,
      })
      .then((response) => {
        const { firstName, lastName, email } = response.data;
        form.reset({
          firstName,
          lastName,
          email,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="Jhon" {...field} />
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
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jhon@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading || !form.formState.isDirty} type="submit">
          {isLoading ? (
            <>
              <ReloadIcon className="w-4 h-4 mr-2 animate-spin" /> Updating...
            </>
          ) : (
            'Update profile'
          )}
        </Button>
      </form>
    </Form>
  );
}
