import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortfolio } from "@/lib/contexts/portfolio-context";
import { Skeleton } from "@/components/ui/skeleton";
import { getPortfolioTransactions } from "@/lib/services/portfolio";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { TransactionsSkeleton } from "@/components/skeleton/transactions-skeleton";
import type { Transaction, TransactionsResponse } from "@/lib/types/portfolio";

export function Transactions() {
  const { selectedPortfolio } = usePortfolio();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!selectedPortfolio) return;
    setLoading(true);
    getPortfolioTransactions(selectedPortfolio.id, page, limit)
      .then(data => {
        setTransactions(data.transactions);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [selectedPortfolio, page, limit]);

  // Filter and search transactions client-side
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(tx => {
      const matchesType = typeFilter === "all" || tx.type.toLowerCase() === typeFilter;
      const matchesSearch =
        search.trim() === "" ||
        tx.assetSymbol.toLowerCase().includes(search.toLowerCase()) ||
        tx.investmentType.toLowerCase().includes(search.toLowerCase()) ||
        tx.region.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, typeFilter, search]);

  if (loading) {
    return <TransactionsSkeleton />
  }

  if (!transactions) {
    return <TransactionsSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-56 ml-auto"
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20" />
                <TableHead className="text-center w-36">Date & Time</TableHead>
                <TableHead className="text-center w-48">Category</TableHead>
                <TableHead className="text-center w-32">Asset</TableHead>
                <TableHead className="text-center w-24">Price</TableHead>
                <TableHead className="text-center w-20">Quantity</TableHead>
                <TableHead className="text-center w-28">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground font-medium">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => {
                  const isBuy = tx.type.toLowerCase() === 'buy';
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="pl-2 font-semibold" style={{ color: isBuy ? '#16a34a' : '#dc2626' }}>
                        {isBuy ? 'BUY' : 'SELL'}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        {new Date(tx.timestamp).toLocaleDateString()}<br />
                        <span className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        {tx.investmentType} - {tx.region}
                      </TableCell>
                      <TableCell className="text-center align-middle font-bold">{tx.assetSymbol}</TableCell>
                      <TableCell className="text-center align-middle">${tx.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center align-middle">{tx.quantity}</TableCell>
                      <TableCell className="text-center align-middle font-semibold">${tx.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-1 font-semibold">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
} 