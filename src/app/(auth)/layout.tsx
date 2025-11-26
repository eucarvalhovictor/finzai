import { AppLogo } from '@/components/app-logo';
import { DotsBackground } from '@/components/ui/dots-background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-y-hidden">
      <DotsBackground />
      <div className="z-10 flex w-full flex-col items-center gap-8">
        <AppLogo />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
