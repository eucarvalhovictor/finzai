import { AppLogo } from '@/components/app-logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      {children}
    </div>
  );
}
