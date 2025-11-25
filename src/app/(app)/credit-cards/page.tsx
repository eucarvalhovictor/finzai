import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { creditCards, formatCurrency } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function CreditCardsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gerenciamento de Cartões"
        description="Acompanhe os saldos, transações e datas de vencimento dos seus cartões."
      />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {creditCards.length > 0 ? creditCards.map((card) => {
          const usagePercentage = (card.balance / card.limit) * 100;
          return (
            <Card key={card.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{card.name}</CardTitle>
                  <span className="text-sm font-mono text-muted-foreground">
                    **** {card.last4}
                  </span>
                </div>
                <CardDescription>
                  Vencimento em {card.dueDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {formatCurrency(card.balance)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {formatCurrency(card.limit)}
                  </span>
                </div>
                <Progress value={usagePercentage} aria-label={`${usagePercentage.toFixed(0)}% usado`} />
                <div>
                  <h3 className="mb-2 text-sm font-medium">Transações Recentes</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {card.transactions.slice(0, 3).map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="font-medium">{tx.description}</div>
                            <div className="text-xs text-muted-foreground">{tx.date}</div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(tx.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
            <Card className="flex items-center justify-center h-64 col-span-2">
                <CardContent>
                    <p className="text-muted-foreground">Nenhum cartão de crédito adicionado.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
