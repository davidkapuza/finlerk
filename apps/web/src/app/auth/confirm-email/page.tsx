import { Metadata } from 'next';
import Confirmation from './components/confirmation';

export const metadata: Metadata = {
  title: 'Confirm email',
  description: 'Confirm email to finish your registration.',
};

export default function ConfirmEmailPage() {
  return <Confirmation />;
}
