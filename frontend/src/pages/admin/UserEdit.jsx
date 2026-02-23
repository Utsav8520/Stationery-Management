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
    name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
    email: z.string().email(),
    address: z.string().min(5, "Address must be at least 5 characters").optional().or(z.literal("")),
    birthdate: z.string().refine((val) => val === "" || !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }).optional().or(z.literal("")),
    role: z.enum(["ADMIN", "CUSTOMER"]),
});

const AdminUserEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loadingUser, setLoadingUser] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            address: "",
            birthdate: "",
            role: "CUSTOMER",
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await api.get(`/users/${id}`);
                form.reset({
                    name: data.name || "",
                    email: data.email,
                    address: data.address || "",
                    birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : "",
                    role: data.role,
                });
            } catch (error) {
                console.error("Failed to fetch user:", error);
                toast.error("Failed to load user for editing.");
            } finally {
                setLoadingUser(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id, form]);

    const onSubmit = async (values) => {
        try {
            await api.put(`/users/${id}`, values);
            toast.success("User updated successfully!");
            navigate("/admin/users");
        } catch (err) {
            console.error("Error updating user:", err);
            toast.error(err.message || "An error occurred while updating the user.");
        }
    };

    if (loadingUser) {
        return (
            <AdminLayout>
                <div className="p-8"><h1 className="text-3xl font-bold">Loading User...</h1></div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link to="/admin/users">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold mb-8">Edit User</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
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
                                            <FormLabel>Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input type="email" disabled {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Address</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthdate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Birthdate</FormLabel>
                                            <FormControl><Input type="date" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-end pt-6">
                                <Button type="submit" size="lg">
                                    Update User
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminUserEditPage;