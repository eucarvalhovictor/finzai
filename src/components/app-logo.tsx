import { Wallet } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <Wallet className="h-7 w-7" />
      <h1 className="text-xl font-bold text-foreground">
        FinzAI
      </h1>
    </div>
  );
}
