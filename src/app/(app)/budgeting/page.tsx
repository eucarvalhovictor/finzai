import { PageHeader } from '@/components/page-header';
import { BudgetForm } from './_components/budget-form';

export default function BudgetingPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Orçamento com IA"
        description="Receba sugestões inteligentes para otimizar seus gastos e alcançar seus objetivos."
      />
      <BudgetForm />
    </div>
  );
}
