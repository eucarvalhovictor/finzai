'use client';

import { useFormState } from 'react-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateBudgetSuggestions, BudgetSchema } from '../actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Trash2, PlusCircle, AlertCircle } from 'lucide-react';

const initialState = {
  message: '',
  isSuccess: false,
};

type BudgetFormValues = z.infer<typeof BudgetSchema>;

export function BudgetForm() {
  const [state, formAction] = useFormState(generateBudgetSuggestions, initialState);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      income: 1000,
      financialGoals: '',
      historicalTransactions: '',
      expenses: [{ category: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'expenses',
  });

  const onSubmit = (data: BudgetFormValues) => {
    const formData = new FormData();
    formData.append('income', String(data.income));
    formData.append('financialGoals', data.financialGoals);
    if(data.historicalTransactions) {
        formData.append('historicalTransactions', data.historicalTransactions);
    }
    data.expenses.forEach(expense => {
      formData.append('expenses', JSON.stringify(expense));
    });
    formAction(formData);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Your Financial Details</CardTitle>
            <CardDescription>Provide your financial information for the AI to analyze.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="income">Monthly Income</Label>
              <Input id="income" type="number" {...form.register('income')} placeholder="e.g., 5000" />
              {form.formState.errors.income && <p className="text-sm text-destructive">{form.formState.errors.income.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Monthly Expenses</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Category (e.g., Rent)"
                    {...form.register(`expenses.${index}.category`)}
                    className="w-1/2"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    {...form.register(`expenses.${index}.amount`)}
                    className="w-1/2"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
               {form.formState.errors.expenses && <p className="text-sm text-destructive">{form.formState.errors.expenses.message}</p>}
              <Button type="button" variant="outline" onClick={() => append({ category: '', amount: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="financialGoals">Financial Goals</Label>
              <Textarea id="financialGoals" {...form.register('financialGoals')} placeholder="e.g., Save for a house down payment, pay off student loans..." />
              {form.formState.errors.financialGoals && <p className="text-sm text-destructive">{form.formState.errors.financialGoals.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="historicalTransactions">Historical Transactions (Optional)</Label>
              <Textarea id="historicalTransactions" {...form.register('historicalTransactions')} placeholder="Paste transaction data (CSV or plain text) for more accurate suggestions." />
            </div>

            {!state.isSuccess && state.message && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {state.message}
                        {state.issues && (
                            <ul className="list-disc pl-5 mt-2">
                                {state.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                            </ul>
                        )}
                    </AlertDescription>
                </Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Generate Suggestions</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            AI Budget Suggestions
          </CardTitle>
          <CardDescription>
            Our AI will provide personalized tips to improve your finances.
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
          {state.isSuccess && state.suggestions ? (
            <div className="rounded-lg border bg-secondary/30 p-4">
              <p>{state.suggestions}</p>
            </div>
          ) : (
            <p>Your personalized budget suggestions will appear here once you submit your financial details.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
