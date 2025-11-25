'use client';
import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // Redireciona para a página de métricas como padrão para a seção de admin
  redirect('/admin/metrics');
}
