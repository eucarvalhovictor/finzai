import { AppLogo } from '@/components/app-logo';
import { DotsBackground } from '@/components/ui/dots-background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative">
      <DotsBackground />
      <div className="absolute top-16 sm:relative sm:top-auto sm:mb-8 z-10">
        <AppLogo />
      </div>
      <div className="z-10 w-full p-4">
        {children}
      </div>
    </div>
  );
}
