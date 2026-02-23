import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";


const transactionFormSchema = z.object({
    amount: z.preprocess(
        (val) => Number(String(val).replace(/[^0-9.-]+/g, "")),
        z.number().positive("Amount must be a positive number")
    ),
    type: z.enum(["CREDIT", "DEBIT"]),
    description: z.string().optional(),
});

const AdminCreditTransactionsPage = () => {
    const { id } = useParams(); // partyId
    const [party, setParty] = useState(null);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const form = useForm({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            amount: 0,
            type: "CREDIT",
            description: "",
        },
    });

    useEffect(() => {
        if (id) {
            fetchPartyAndTransactions();
        }
    }, [id]);

    const fetchPartyAndTransactions = async () => {
        setLoading(true);
        try {
            const partyData = await api.get(`/credits/parties/${id}`);
            setParty(partyData);

            const transactionsData = await api.get(`/credits/transactions/${id}`);
            setTransactions(transactionsData.transactions);
            setPagination(transactionsData.pagination);

            const balanceData = await api.get(`/credits/balance/${id}`);
            setBalance(balanceData.balance);

        } catch (error) {
            console.error("Failed to fetch party and transactions:", error);
            toast.error("Failed to load party and transactions.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values) => {
        try {
            await api.post("/credits/transactions", {
                partyId: parseInt(id),
                ...values,
            });
            toast.success("Transaction added successfully!");
            form.reset();
            fetchPartyAndTransactions(); // Refresh list
        } catch (err) {
            console.error("Error adding transaction:", err);
            toast.error(err.message || "An error occurred while adding the transaction.");
        }
    };
    
    const getTransactionTypeColor = (type) => {
        return type === 'CREDIT' ? 'bg-green-500' : 'bg-red-500';
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8"><h1 className="text-3xl font-bold">Loading Transactions...</h1></div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link to="/admin/credits">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Credit Parties
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold mb-2">Transactions for {party?.name}</h1>
                <p className="text-muted-foreground">Manage credit and debit for this party.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                Rs. {balance.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {balance >= 0 ? "You are owed" : "You owe"}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Amount</FormLabel>
                                                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="CREDIT">Credit (Receiving)</SelectItem>
                                                        <SelectItem value="DEBIT">Debit (Giving)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl><Input placeholder="Optional" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">Add Transaction</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="font-medium">
                                                    Rs. {transaction.amount.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${getTransactionTypeColor(transaction.type)} text-white`}>
                                                        {transaction.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{transaction.description || "N/A"}</TableCell>
                                                <TableCell>
                                                    {new Date(transaction.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-8">
                            {/* Pagination component here if needed */}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCreditTransactionsPage;