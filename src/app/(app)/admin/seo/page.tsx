'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { SeoSettings } from '@/lib/types';

const seoSchema = z.object({
  siteTitle: z.string().min(1, 'O título do site é obrigatório.'),
  defaultDescription: z.string().min(1, 'A descrição é obrigatória.'),
});

type SeoFormValues = z.infer<typeof seoSchema>;

export default function AdminSeoPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const seoSettingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'globalSeo');
  }, [firestore]);

  const { data: seoSettings, isLoading } = useDoc<SeoSettings>(seoSettingsRef);

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      siteTitle: '',
      defaultDescription: '',
    },
  });

  useEffect(() => {
    if (seoSettings) {
      form.reset({
        siteTitle: seoSettings.siteTitle || '',
        defaultDescription: seoSettings.defaultDescription || '',
      });
    }
  }, [seoSettings, form]);

  async function onSubmit(data: SeoFormValues) {
    if (!seoSettingsRef) return;
    setIsSubmitting(true);
    try {
      await setDoc(seoSettingsRef, data, { merge: true });
      toast({
        title: 'Configurações Salvas!',
        description: 'Suas configurações de SEO foram atualizadas com sucesso.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar as configurações de SEO.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Controle de SEO"
        description="Gerencie as meta tags, sitemaps e outras configurações de SEO do site."
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>SEO Global</CardTitle>
              <CardDescription>
                Defina o título padrão e a descrição para todo o site. Eles serão usados em páginas que não possuem metadados específicos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Site</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: FinzAI - Sua Plataforma Financeira" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Padrão</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Gerencie suas finanças, investimentos e cartões de crédito de forma inteligente com FinzAI."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
