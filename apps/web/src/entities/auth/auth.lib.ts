'use server';

import { InvalidLoginError, signIn } from '@/shared/lib/next-auth';

export async function authenticate(email: string, password: string) {
  try {
    const response = await signIn('credentials', {
      username: email,
      password: password,
      callbackUrl: '/',
      redirect: false,
    });
    return response;
  } catch (error) {
    if (error instanceof InvalidLoginError) {
      return { error: error.error };
    } else {
      throw Error('Failed to authenticate');
    }
  }
}
