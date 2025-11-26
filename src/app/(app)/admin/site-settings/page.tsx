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
import { Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const seoSchema = z.object({
  siteTitle: z.string().min(1, 'O título do site é obrigatório.'),
  defaultDescription: z.string().min(1, 'A descrição é obrigatória.'),
  faviconUrl: z.string().optional(),
  logoUrl: z.string().optional(),
});

type SeoFormValues = z.infer<typeof seoSchema>;

export default function AdminSiteSettingsPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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
      faviconUrl: '',
      logoUrl: '',
    },
  });

  useEffect(() => {
    if (seoSettings) {
      form.reset({
        siteTitle: seoSettings.siteTitle || '',
        defaultDescription: seoSettings.defaultDescription || '',
        faviconUrl: seoSettings.faviconUrl || '',
        logoUrl: seoSettings.logoUrl || '',
      });
       if (seoSettings.faviconUrl) {
          setFaviconPreview(seoSettings.faviconUrl);
      }
      if (seoSettings.logoUrl) {
          setLogoPreview(seoSettings.logoUrl);
      }
    }
  }, [seoSettings, form]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void, fieldName: keyof SeoFormValues) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setter(dataUrl);
        form.setValue(fieldName, dataUrl, { shouldDirty: true });
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
        description: 'Suas configurações de SEO e de marca foram atualizadas com sucesso.',
      });
      form.reset(data, { keepValues: true }); // Resets dirty state
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar as configurações.',
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
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
          </Card>
          
           <Card>
                <CardHeader>
                    <CardTitle>Marca</CardTitle>
                    <CardDescription>
                        Personalize a logo e o favicon que aparecem no site.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <FormField
                        control={form.control}
                        name="logoUrl"
                        render={() => (
                           <FormItem>
                            <FormLabel>Logo do Projeto</FormLabel>
                            <div className="flex items-center gap-4">
                                {logoPreview ? (
                                    <Image src={logoPreview} alt="Pré-visualização da Logo" width={128} height={32} className="rounded-md object-contain h-8" />
                                ) : (
                                    <div className="flex h-12 w-32 items-center justify-center rounded-md border bg-muted">
                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <Button asChild variant="outline">
                                    <label htmlFor="logo-upload" className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Carregar Logo
                                    <Input id="logo-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleFileChange(e, setLogoPreview, 'logoUrl')} />
                                    </label>
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">Pelo menos 64x64 pixels. Fundo transparente recomendado (.png ou .svg).</p>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="faviconUrl"
                        render={() => (
                            <FormItem>
                                <FormLabel>Favicon</FormLabel>
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
                                        <Input id="favicon-upload" type="file" className="hidden" accept="image/png, image/x-icon, image/vnd.microsoft.icon" onChange={(e) => handleFileChange(e, setFaviconPreview, 'faviconUrl')} />
                                        </label>
                                    </Button>
                                </div>
                                 <p className="text-xs text-muted-foreground pt-1">Recomendado: imagem .png ou .ico de 32x32 pixels.</p>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>


          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || isLoading || !form.formState.isDirty}>
              {isSubmitting ? 'Salvando...' : 'Salvar Todas as Configurações'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
