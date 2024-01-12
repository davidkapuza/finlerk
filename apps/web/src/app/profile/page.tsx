import { ProfileForm } from './components/profile-form';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';

async function getUser() {
  return await api
    .get('/api/v1/users/my-profile')
    .then((response) => response.data);
}

export default async function SettingsProfilePage() {
  const user = await getUser();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </div>
  );
}
