"use client";

// hooks
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// components
import SpinnerMini from "@/components/SpinnerMini";
// server actions
import { createUpdateProduct } from "@/lib/actions/productActions";
// types
import { productSchema, ProductSchema } from "@/lib/types/productSchema";
// libs
import { getErrorMessage } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
// assets
import { Euro, Pencil, Send, Text } from "lucide-react";

const CreateProductForm = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
    });

    const onSubmit = async (data: ProductSchema) => {
        try {
            const response = await createUpdateProduct(data);
            if (response.success) {
                toast.success(response.message);
                router.push("/workspace/products");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    }

    return (
        <div className="max-w-lg w-full mx-auto">
            <div className="flex items-center gap-1">
                <Pencil className="text-blue-500 size-5" />
                <h1 className="text-xl font-semibold text-center text-blue-500">
                    Create
                </h1>
            </div>
            <p className="text-xs text-gray-500">Create a new product</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2 my-5 space-y-3">
                    <div className="relative">
                        <input
                            {...register("title")}
                            type="text"
                            name="title"
                            placeholder="Title"
                            autoComplete="off"
                            disabled={isSubmitting}
                            className="input"
                        />
                        <Pencil className="left-input-icon" />
                        {errors.title && <p className="error mt-1">{errors.title.message}</p>}
                    </div>
                    <div className="relative">
                        <textarea
                            {...register("description")}
                            name="description"
                            placeholder="Description"
                            autoComplete="off"
                            disabled={isSubmitting}
                            className="input min-h-52"
                        />
                        <Text className="left-input-icon" />
                        {errors.description && <p className="error mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="relative">
                        <input
                            {...register("price")}
                            type="number"
                            name="price"
                            placeholder="Price"
                            autoComplete="off"
                            disabled={isSubmitting}
                            className="input"
                        />
                        <Euro className="left-input-icon" />
                        {errors.price && <p className="error mt-1">{errors.price.message}</p>}
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
                    className="primary-btn"
                >
                    {isSubmitting ? <SpinnerMini /> : (
                        <>
                            <span>Create a new product</span>
                            <Send className="size-4 text-white" />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    )
};

export default CreateProductForm;