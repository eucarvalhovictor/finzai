'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-powered-budget-suggestions.ts';

// O fluxo para definir o cargo do usuário foi removido.
// O gerenciamento de cargos agora é feito pela interface de administração.
