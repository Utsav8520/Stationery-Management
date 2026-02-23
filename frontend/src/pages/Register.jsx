import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
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
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
});

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            address: "",
            birthdate: "",
        },
    });

    const onSubmit = async (values) => {
        try {
            const data = await api.post("/auth/register", values);
            if (data.token && data.user) {
                // Auto-login after successful registration
                login(data.token, data.user);
                navigate("/");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <MainLayout>
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input placeholder="Enter your name" {...field} /></FormControl>
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
                                    <FormControl><Input placeholder="Enter your email" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input
                                        type="password"
                                        placeholder="Enter your password"
                                        {...field}
                                    /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl><Input placeholder="Enter your address" {...field} /></FormControl>
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
                        {error && <p className="text-destructive text-sm">{error}</p>}
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </Form>
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </MainLayout>
    );
};

export default RegisterPage;
