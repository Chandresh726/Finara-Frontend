import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePortfolio } from "@/lib/contexts/portfolio-context";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { TransactionsSkeleton } from "@/components/skeleton/transactions-skeleton";
import type { Transaction } from "@/lib/types/portfolio";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function Transactions() {
  const {
    transactions,
    transactionsTotal,
    transactionsPage,
    loadingStates,
    fetchTransactions,
    setTransactionsPage,
  } = usePortfolio();

  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const limit = 10;

  // Only fetch if we don't have transactions data yet
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      fetchTransactions(1);
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setTransactionsPage(newPage);
    fetchTransactions(newPage);
  };

  // Filter and search transactions client-side
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx: Transaction) => {
      const matchesType = typeFilter === "all" || tx.type.toLowerCase() === typeFilter;
      const matchesSearch =
        search.trim() === "" ||
        tx.assetSymbol.toLowerCase().includes(search.toLowerCase()) ||
        tx.investmentType.toLowerCase().includes(search.toLowerCase()) ||
        tx.region.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, typeFilter, search]);

  if (loadingStates.transactions) {
    return <TransactionsSkeleton />;
  }

  const totalPages = Math.ceil(transactionsTotal / limit);

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
          onChange={(e) => setSearch(e.target.value)}
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
                filteredTransactions.map((tx: Transaction) => {
                  const isBuy = tx.type.toLowerCase() === 'buy';
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="pl-2 font-semibold" style={{ color: isBuy ? '#16a34a' : '#dc2626' }}>
                        {isBuy ? 'BUY' : 'SELL'}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        {new Date(tx.timestamp).toLocaleDateString()}<br />
                        <span className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
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
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(transactionsPage - 1)}
                  className={transactionsPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === transactionsPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(transactionsPage + 1)}
                  className={transactionsPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
} 