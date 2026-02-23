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
import api from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Price must be a positive number")
  ),
  stock: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "Stock cannot be negative")
  ),
  category: z.string().optional(),
  image: z.any().optional(), // For file input
});

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [initialImageUrl, setInitialImageUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      image: null,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get(`/products/${id}`);
        form.reset({
          name: data.name,
          description: data.description || "",
          price: data.price,
          stock: data.stock,
          category: data.category || "",
          image: null, // Image field should be reset for new upload
        });
        setInitialImageUrl(data.imageUrl);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("Failed to load product for editing.");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id, form]);

  const onSubmit = async (values) => {
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (key === "image" && values[key] && values[key].length > 0) {
          formData.append(key, values[key][0]); // Append the new file
        } else if (key !== "image" && values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' is automatically set with FormData
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product updated successfully!");
        navigate("/admin/products");
      } else {
        setError(data.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message || "An error occurred while updating product.");
    }
  };

  if (loadingProduct) {
    return (
      <AdminLayout>
        <p>Loading product details...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
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
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
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
                <FormLabel>Stock</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                {initialImageUrl && (
                  <div className="mb-2">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${initialImageUrl}`}
                      alt="Current Product"
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      onChange(event.target.files);
                    }}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <Button type="submit" className="w-full">
            Update Product
          </Button>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default AdminProductEditPage;
