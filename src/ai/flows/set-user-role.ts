'use server';
/**
 * @fileOverview Fluxo para definir o cargo de um usuário no Firestore.
 * ATENÇÃO: Este é um fluxo administrativo e deve ser usado com cuidado.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/config';

// Inicializa o app do Firebase para acesso ao Firestore no lado do servidor
const firebaseApp = initializeFirebase();
const db = getFirestore(firebaseApp);

const SetUserRoleInputSchema = z.object({
  email: z.string().email().describe('O e-mail do usuário para o qual o cargo será alterado.'),
  role: z.enum(['basico', 'completo', 'admin']).describe('O novo cargo a ser atribuído ao usuário.'),
});

const SetUserRoleOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const setUserRoleFlow = ai.defineFlow(
  {
    name: 'setUserRoleFlow',
    inputSchema: SetUserRoleInputSchema,
    outputSchema: SetUserRoleOutputSchema,
  },
  async ({ email, role }) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: false,
          message: `Nenhum usuário encontrado com o e-mail: ${email}`,
        };
      }

      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        console.log(`Atualizando cargo do usuário ${doc.id} para ${role}`);
        batch.update(doc.ref, { role: role });
      });
      
      await batch.commit();

      return {
        success: true,
        message: `O cargo do usuário com e-mail ${email} foi atualizado para ${role} com sucesso.`,
      };

    } catch (error: any) {
      console.error('Erro ao atualizar o cargo do usuário:', error);
      return {
        success: false,
        message: error.message || 'Ocorreu um erro inesperado.',
      };
    }
  }
);

// Fluxo específico para definir o usuário como admin
export const setVictorAsAdmin = ai.defineFlow(
    {
        name: 'setVictorAsAdmin',
        inputSchema: z.null(),
        outputSchema: SetUserRoleOutputSchema,
    },
    async () => {
        return await setUserRoleFlow({ email: 'victorcarvalhocarvalho4@gmail.com', role: 'admin' });
    }
);
