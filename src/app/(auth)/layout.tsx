import { AppLogo } from '@/components/app-logo';
import { DotsBackground } from '@/components/ui/dots-background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <DotsBackground />
      <div className="mb-8 z-10">
        <AppLogo />
      </div>
      <div className="z-10 w-full">
        {children}
      </div>
    </div>
  );
}
