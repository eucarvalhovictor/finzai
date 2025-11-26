'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const assetTypes = ["Ação", "FII", "BDR", "Cripto", "Renda Fixa"] as const;
const brokerages = ["XP Investimentos", "BTG Pactual", "Banco Inter", "NuInvest", "Rico", "Outra"] as const;

const investmentSchema = z.object({
  name: z.string().min(1, 'Nome do ativo é obrigatório.'),
  ticker: z.string().min(1, 'Ticker é obrigatório.'),
  type: z.enum(assetTypes, { required_error: 'Selecione um tipo de ativo.' }),
  quantity: z.coerce.number().positive('A quantidade deve ser um número positivo.'),
  valuePerShare: z.coerce.number().positive('O valor por cota deve ser um número positivo.'),
  institution: z.enum(brokerages, { required_error: 'Selecione uma corretora.' }),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

interface AddInvestmentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddInvestmentDialog({ isOpen, onOpenChange }: AddInvestmentDialogProps) {
  const { user, firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
  });

  async function onSubmit(data: InvestmentFormValues) {
    setIsSubmitting(true);
    if (!firestore || !user) {
        toast({ title: 'Erro', description: 'Serviços do Firebase não estão disponíveis.' });
        setIsSubmitting(false);
        return;
    }

    try {
        const investmentsCollection = collection(firestore, `users/${user.uid}/investments`);
        const newInvestmentData = {
            userId: user.uid,
            ...data,
        };
        addDocumentNonBlocking(investmentsCollection, newInvestmentData);

        toast({
            title: 'Ativo Adicionado!',
            description: `${data.name} foi adicionado à sua carteira.`,
        });
        
        form.reset();
        onOpenChange(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Adicionar Ativo',
        description: error.message || 'Não foi possível adicionar o ativo.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ativo</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do seu investimento/aporte.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Ativo</FormLabel>
                            <FormControl><Input placeholder="Ex: Petrobras PN" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="ticker"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticker</FormLabel>
                            <FormControl><Input placeholder="PETR4" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione um tipo" /></SelectTrigger></FormControl>
                                <SelectContent>
                                     {assetTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cotas (Quantidade)</FormLabel>
                                <FormControl><Input type="number" step="0.01" placeholder="100" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="valuePerShare"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor / Cota</FormLabel>
                                <FormControl><Input type="number" step="0.01" placeholder="42.50" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Corretora</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione a corretora" /></SelectTrigger></FormControl>
                                <SelectContent>
                                     {brokerages.map((broker) => (
                                        <SelectItem key={broker} value={broker}>{broker}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adicionando...' : 'Adicionar Ativo'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    