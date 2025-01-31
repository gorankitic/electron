// components
import CreateProductForm from "@/components/create/CreateProductForm";
// lib
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const CreateProduct = async () => {
    const session = await auth();
    if (session?.user.role !== "admin") return redirect("/workspace/settings");

    return <CreateProductForm />
}

export default CreateProduct;