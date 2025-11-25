import { config } from 'dotenv';
config();

import '@/ai/flows/ai-powered-budget-suggestions.ts';
import '@/ai/flows/ai-budget-suggestions.ts';
import { setVictorAsAdmin } from '@/ai/flows/set-user-role';

// Para executar a função e definir o usuário como admin,
// você pode chamar a função setVictorAsAdmin() aqui e executar o servidor de desenvolvimento do Genkit.
// Exemplo:
// setVictorAsAdmin(null).then(console.log).catch(console.error);
