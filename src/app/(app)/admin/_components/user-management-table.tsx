'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { UserProfile, UserRole } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';


const roles: UserRole[] = ['basico', 'completo', 'admin'];

interface UserManagementTableProps {
  searchTerm: string;
}

export function UserManagementTable({ searchTerm }: UserManagementTableProps) {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = React.useState<UserProfile | null>(null);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm) return users;
    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter(u => 
      u.firstName.toLowerCase().includes(lowercasedFilter) ||
      (u.lastName && u.lastName.toLowerCase().includes(lowercasedFilter)) ||
      u.email.toLowerCase().includes(lowercasedFilter)
    );
  }, [users, searchTerm]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Erro de Autenticação",
            description: "Você precisa estar logado como administrador para realizar esta ação.",
        });
        return;
    }

    const userDocRef = doc(firestore, 'users', userId);

    try {
        await updateDoc(userDocRef, {
            role: newRole,
        });

        toast({
            title: "Cargo Atualizado",
            description: `O cargo do usuário foi alterado para ${newRole}.`,
        });
    } catch (error: any) {
        console.error(`❌ Erro ao atualizar o cargo do usuário ${userId}:`, error);
        toast({
            variant: "destructive",
            title: "Erro de Permissão",
            description: "Ocorreu um erro ao atualizar o cargo. Verifique suas permissões de administrador.",
        });
    }
  };

  const handleDeleteUser = async (userId: string) => {
     if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Erro de Autenticação",
            description: "Você precisa estar logado como administrador.",
        });
        return;
    }
    const userDocRef = doc(firestore, 'users', userId);
    try {
        await deleteDoc(userDocRef);
        toast({
            title: "Usuário Excluído",
            description: "O usuário foi removido do sistema.",
        });
        setUserToDelete(null); // Fecha o diálogo
    } catch (error: any) {
        console.error(`❌ Erro ao excluir o usuário ${userId}:`, error);
        toast({
            variant: "destructive",
            title: "Erro ao Excluir",
            description: "Ocorreu um erro ao excluir o usuário. Verifique suas permissões.",
        });
    }
  };

  return (
    <>
    <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="w-[180px]">Cargo</TableHead>
          <TableHead className="w-[50px] text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-10 w-full" /></TableCell>
              <TableCell><Skeleton className="h-10 w-8" /></TableCell>
            </TableRow>
          ))
        ) : filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{`${u.firstName} ${u.lastName || ''}`}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Select
                  defaultValue={u.role}
                  onValueChange={(value: UserRole) => handleRoleChange(u.id, value)}
                  disabled={u.id === user?.uid} // Desabilita para o próprio admin
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                 {u.id !== user?.uid && (
                    <AlertDialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                                <span className="sr-only">Ações</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => {e.preventDefault(); setUserToDelete(u)}}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir Usuário
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                        </DropdownMenu>
                         {userToDelete && userToDelete.id === u.id && (
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso irá excluir permanentemente o usuário <span className="font-bold">{userToDelete.firstName} {userToDelete.lastName}</span> do sistema.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => handleDeleteUser(userToDelete.id)}
                                >
                                    Sim, excluir usuário
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        )}
                    </AlertDialog>
                 )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              Nenhum usuário encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </Card>
    </>
  );
}
