import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    contact: z.string().optional(),
    type: z.enum(["Supplier", "Customer"]),
});

const AdminCreditPartyCreatePage = () => {
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            contact: "",
            type: "Supplier",
        },
    });

    const onSubmit = async (values) => {
        try {
            await api.post("/credits/parties", values);
            toast.success("Credit party created successfully!");
            navigate("/admin/credits");
        } catch (err) {
            console.error("Error creating credit party:", err);
            toast.error(err.message || "An error occurred while creating the credit party.");
        }
    };

    return (
        <AdminLayout>
            <div>
                <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link to="/admin/credits">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Credit Parties
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold mb-8">Add New Credit Party</h1>
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Create a New Party</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Party Name</FormLabel>
                                        <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact (Optional)</FormLabel>
                                        <FormControl><Input placeholder="e.g., +977 98xxxxxxxx" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Party Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Supplier">Supplier</SelectItem>
                                                <SelectItem value="Customer">Customer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end pt-6">
                                <Button type="submit" size="lg">
                                    Create Party
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminCreditPartyCreatePage;