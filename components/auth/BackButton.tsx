// components
import { Button } from "@/components/ui/button";
import Link from "next/link";

type BackButtonProps = {
    href: string,
    label: string
}

const BackButton = ({ href, label }: BackButtonProps) => {

    return (
        <Button>
            <Link href={href}>{label}</Link>
        </Button>
    )
}
export default BackButton;