import { Separator } from '@qbick/shadcn-ui';
// import api from '../../lib/api';

// async function getUser() {
//   return await api
//     .get('/api/v1/users/my-profile')
//     .then((response) => response.data);
// }

export default async function SettingsProfilePage() {
  // TODO getting user profile

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      {/* <ProfileForm user={user} /> */}
    </div>
  );
}
