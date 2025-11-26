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
import { useFirebase, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SeoSettings } from '@/lib/types';
import { Upload } from 'lucide-react';
import Image from 'next/image';

const seoSchema = z.object({
  siteTitle: z.string().min(1, 'O título do site é obrigatório.'),
  defaultDescription: z.string().min(1, 'A descrição é obrigatória.'),
});

type SeoFormValues = z.infer<typeof seoSchema>;

export default function AdminSiteSettingsPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

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
  
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
        // Em um app real, aqui você faria o upload do arquivo para o Firebase Storage
        // e salvaria a URL no Firestore. Por enquanto, apenas exibimos o preview.
        toast({
            title: 'Pré-visualização do Favicon',
            description: 'Em uma aplicação real, o upload para o servidor seria feito aqui.',
        })
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: SeoFormValues) {
    if (!seoSettingsRef) return;
    setIsSubmitting(true);
    try {
      setDocumentNonBlocking(seoSettingsRef, data, { merge: true });
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
        title="Configurações do Site"
        description="Gerencie as meta tags, favicon e outras configurações globais do site."
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>SEO Global & Meta Tags</CardTitle>
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
                        <FormLabel>Título do Site (Meta Title)</FormLabel>
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
                        <FormLabel>Descrição Padrão (Meta Description)</FormLabel>
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
                {isSubmitting ? 'Salvando...' : 'Salvar Configurações de SEO'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

       <Card>
        <CardHeader>
          <CardTitle>Favicon</CardTitle>
          <CardDescription>
            Faça o upload do ícone que aparece na aba do navegador. Recomenda-se uma imagem .png ou .ico de 32x32 pixels.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <FormItem>
                <div className="flex items-center gap-4">
                    {faviconPreview ? (
                        <Image src={faviconPreview} alt="Pré-visualização do Favicon" width={32} height={32} className="rounded-md" />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    <Button asChild variant="outline">
                        <label htmlFor="favicon-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Carregar Favicon
                        <Input id="favicon-upload" type="file" className="hidden" accept="image/png, image/x-icon, image/vnd.microsoft.icon" onChange={handleFaviconChange} />
                        </label>
                    </Button>
                </div>
            </FormItem>
        </CardContent>
      </Card>
    </div>
  );
}
