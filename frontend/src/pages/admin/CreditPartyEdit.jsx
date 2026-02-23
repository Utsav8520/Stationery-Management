import { useEffect, useState } from "react";
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
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    contact: z.string().optional(),
    type: z.enum(["Supplier", "Customer"]),
});

const AdminCreditPartyEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loadingParty, setLoadingParty] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            contact: "",
            type: "Supplier",
        },
    });

    useEffect(() => {
        const fetchParty = async () => {
            try {
                const data = await api.get(`/credits/parties/${id}`);
                form.reset({
                    name: data.name,
                    contact: data.contact || "",
                    type: data.type,
                });
            } catch (error) {
                console.error("Failed to fetch credit party:", error);
                toast.error("Failed to load credit party for editing.");
            } finally {
                setLoadingParty(false);
            }
        };

        if (id) {
            fetchParty();
        }
    }, [id, form]);

    const onSubmit = async (values) => {
        try {
            await api.put(`/credits/parties/${id}`, values);
            toast.success("Credit party updated successfully!");
            navigate("/admin/credits");
        } catch (err) {
            console.error("Error updating credit party:", err);
            toast.error(err.message || "An error occurred while updating the credit party.");
        }
    };

    if (loadingParty) {
        return (
            <AdminLayout>
                <div className="p-8"><h1 className="text-3xl font-bold">Loading Credit Party...</h1></div>
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
                <h1 className="text-3xl font-bold mb-8">Edit Credit Party</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Party Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Party Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
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
                            </div>
                            <div className="flex justify-end pt-6">
                                <Button type="submit" size="lg">
                                    Update Credit Party
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminCreditPartyEditPage;