// components
import Link from "next/link";
import Logo from "@/components/Logo";
import SocialButtons from "@/components/auth/SocialButtons";
// types
import { LucideIcon } from 'lucide-react';

type AuthCardProps = {
    children: React.ReactNode,
    title: string,
    backLinkHref: string,
    backLinkLabel: string,
    showSocials?: boolean,
    leftIcon?: LucideIcon
    rightIcon?: LucideIcon
}

const AuthCard = ({ children, title, backLinkHref, backLinkLabel, showSocials, leftIcon: LeftIcon, rightIcon: RightIcon }: AuthCardProps) => {

    return (
        <div className="max-w-lg w-full mx-auto my-auto bg-gray-200 bg-opacity-50 rounded-lg shadow-md overflow-hidden">
            <div className="py-8 px-5">
                <div className="flex justify-center text-xl text-gray-600">
                    <Logo size={20} />
                </div>
                <h1 className="text-2xl my-5 font-bold text-center uppercase bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">
                    {title}
                </h1>
                {children}
                {showSocials && (
                    <SocialButtons />
                )}
            </div>
            <div className="px-8 py-3 text-sm bg-gray-500 bg-opacity-50 flex justify-center">
                <Link href={backLinkHref} className="flex items-center gap-1 hover:text-blue-600 hover:underline">
                    {LeftIcon && <LeftIcon className="w-4 h-4 text-gray-700" />}
                    <span>{backLinkLabel}</span>
                    {RightIcon && <RightIcon className="w-4 h-4 text-gray-700" />}
                </Link>
            </div>
        </div>
    )
}

export default AuthCard;