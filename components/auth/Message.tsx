// assets
import { CircleCheckBig, CircleX } from "lucide-react";
// utils
import { cn } from "@/lib/utils";

type MessageProps = {
    message?: string;
    type: "info" | "error";
    className?: string,
}

const Message = ({ message, type, className }: MessageProps) => {
    if (!message) return null;

    return (
        <div className={cn("flex items-center gap-1 mt-1", className)}>
            {type === "info" && <CircleCheckBig className="w-4 h-4 text-blue-600" />}
            {type === "error" && <CircleX className="w-4 h-4 text-red-500" />}
            <span
                className={cn("text-sm", type === "info" && "text-blue-600", type === "error" && "text-red-500")}
            >
                {message}
            </span>
        </div>
    )
}

export default Message;