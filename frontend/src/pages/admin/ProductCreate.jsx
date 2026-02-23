import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";


const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    price: z.preprocess(
        (val) => Number(String(val).replace(/[^0-9.-]+/g, "")),
        z.number().positive("Price must be a positive number")
    ),
    stock: z.preprocess(
        (val) => Number(String(val).replace(/[^0-9]+/g, "")),
        z.number().int().min(0, "Stock cannot be negative")
    ),
    category: z.string().optional(),
    featured: z.boolean().default(false),
    image: z.instanceof(FileList).optional(),
});


const AdminProductCreatePage = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            category: "",
            featured: false,
        },
    });

    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            // Append all form values to FormData
            Object.entries(values).forEach(([key, value]) => {
                if (key === "image" && value instanceof FileList && value.length > 0) {
                    formData.append(key, value[0]);
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            await api.post("/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Product created successfully!");
            navigate("/admin/products");
        } catch (err) {
            console.error("Error creating product:", err);
            toast.error(err.message || "An error occurred while creating the product.");
        }
    };

    return (
        <AdminLayout>
            <div>
                <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link to="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl><Input placeholder="e.g., Premium Whiskey" {...field} /></FormControl>
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
                                                <FormControl><Textarea placeholder="Describe the product..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price (Rs.)</FormLabel>
                                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="stock"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stock Quantity</FormLabel>
                                                    <FormControl><Input type="number" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                            <Card>
                                <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl><Input placeholder="e.g., Wine, Tequila" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="featured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Featured Product</FormLabel>
                                                    <FormDescription>Display this product on the homepage.</FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Product Image</CardTitle></CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field: { onChange, value, ...rest } }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(event) => {
                                                            onChange(event.target.files);
                                                            if (event.target.files && event.target.files[0]) {
                                                                setImagePreview(URL.createObjectURL(event.target.files[0]));
                                                            }
                                                        }}
                                                        {...rest}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded-lg" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" size="lg">
                            Create Product
                        </Button>
                    </div>
                </form>
            </Form>
        </AdminLayout>
    );
};

export default AdminProductCreatePage;