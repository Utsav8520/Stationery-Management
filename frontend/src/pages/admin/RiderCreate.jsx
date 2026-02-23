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
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().min(10, "Contact must be at least 10 characters").optional().or(z.literal("")),
  vehicle: z.string().optional(),
});

const AdminRiderCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      vehicle: "",
    },
  });

  const onSubmit = async (values) => {
    setError(null);
    setSuccess(null);
    try {
      const data = await api.post("/riders", values);
      if (data.id) {
        setSuccess("Rider created successfully!");
        form.reset();
        navigate("/admin/riders");
      } else {
        setError(data.message || "Failed to create rider.");
      }
    } catch (err) {
      console.error("Error creating rider:", err);
      setError(err.message || "An error occurred while creating rider.");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Add New Rider</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rider Name</FormLabel>
                                  <FormControl><Input placeholder="Enter rider name" {...field} /></FormControl>                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                                  <FormControl><Input placeholder="Enter contact number" {...field} /></FormControl>                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                                  <FormControl><Input placeholder="e.g., Bike, Van" {...field} /></FormControl>                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <Button type="submit" className="w-full">
            Create Rider
          </Button>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default AdminRiderCreatePage;
