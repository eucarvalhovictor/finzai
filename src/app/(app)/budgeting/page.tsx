import { PageHeader } from '@/components/page-header';
import { AIConsultant } from './_components/ai-consultant';

export default function BudgetingPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Consultor Financeiro AI"
        description="Receba uma análise detalhada e dicas assertivas para seu perfil financeiro."
      />
      <AIConsultant />
    </div>
  );
}
