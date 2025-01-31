import { JSX } from "react";
// assets
import { BarChart, Box, Pencil, Settings, Truck } from "lucide-react";

export type NavLink = {
    label: string;
    path: string;
    icon: JSX.Element
};

export const userLinks: NavLink[] = [
    {
        label: "Orders",
        path: "/workspace/orders",
        icon: <Truck size={16} />
    },
    {
        label: "Settings",
        path: "/workspace/settings",
        icon: <Settings size={16} />
    },
] as const;

export const adminLinks = [
    {
        label: "Analytics",
        path: "/workspace/analytics",
        icon: <BarChart size={16} />
    },
    {
        label: "Create",
        path: "/workspace/create",
        icon: <Pencil size={16} />
    },
    {
        label: "Products",
        path: "/workspace/products",
        icon: <Box size={16} />,
    },
] as const;