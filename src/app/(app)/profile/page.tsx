import { PageHeader } from '@/components/page-header';
import { UserProfileForm } from './_components/user-profile-form';
import { ChangePasswordForm } from './_components/change-password-form';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  return (
    <div className="grid gap-8">
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais e configurações de segurança."
      />
      
      <div className="grid gap-6">
        <UserProfileForm />
        <Separator />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
