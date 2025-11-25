import { PageHeader } from '@/components/page-header';
import { BudgetForm } from './_components/budget-form';

export default function BudgetingPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="AI-Powered Budgeting"
        description="Get smart suggestions to optimize your spending and reach your financial goals."
      />
      <BudgetForm />
    </div>
  );
}
