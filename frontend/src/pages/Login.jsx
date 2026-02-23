
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
    email: z.string().email(),
    password: z.string().min(6),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    const redirectUrl = searchParams.get("redirect") || null;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values) => {
        try {
            const data = await api.post("/auth/login", values);
            if (data.token) {
                login(data.token, data.user);

                // Redirect to original page or based on role
                if (redirectUrl) {
                    navigate(redirectUrl);
                } else if (data.user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <MainLayout>
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Login</h1>
                    <p className="text-muted-foreground">Sign in to your account to continue</p>
                </div>

                <div className="bg-card border rounded-xl p-8 shadow-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormControl>
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
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-destructive text-sm">{error}</p>}
                            <Button type="submit" className="w-full bg-gradient-primary">
                                Login
                            </Button>
                        </form>
                    </Form>

                    <p className="mt-6 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline font-semibold">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoginPage;

