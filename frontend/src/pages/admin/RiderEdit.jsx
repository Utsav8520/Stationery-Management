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
    contact: z.string().min(10, "Contact must be at least 10 characters").optional().or(z.literal("")),
    vehicle: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

const AdminRiderEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loadingRider, setLoadingRider] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            contact: "",
            vehicle: "",
            status: "ACTIVE",
        },
    });

    useEffect(() => {
        const fetchRider = async () => {
            try {
                const data = await api.get(`/riders/${id}`);
                form.reset({
                    name: data.name,
                    contact: data.contact || "",
                    vehicle: data.vehicle || "",
                    status: data.status,
                });
            } catch (error) {
                console.error("Failed to fetch rider:", error);
                toast.error("Failed to load rider for editing.");
            } finally {
                setLoadingRider(false);
            }
        };

        if (id) {
            fetchRider();
        }
    }, [id, form]);

    const onSubmit = async (values) => {
        try {
            await api.put(`/riders/${id}`, values);
            toast.success("Rider updated successfully!");
            navigate("/admin/riders");
        } catch (err) {
            console.error("Error updating rider:", err);
            toast.error(err.message || "An error occurred while updating the rider.");
        }
    };

    if (loadingRider) {
        return (
            <AdminLayout>
                <div className="p-8"><h1 className="text-3xl font-bold">Loading Rider...</h1></div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link to="/admin/riders">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Riders
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold mb-8">Edit Rider</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Rider Information</CardTitle>
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
                                            <FormLabel>Rider Name</FormLabel>
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
                                            <FormLabel>Contact Number</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vehicle</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger>
                                                    <SelectValue placeholder="Select a status" />
                                                </SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-end pt-6">
                                <Button type="submit" size="lg">
                                    Update Rider
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminRiderEditPage;