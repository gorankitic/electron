"use client";

// hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// components
import Image from "next/image";
import Message from "@/components/auth/Message";
import SpinnerMini from "@/components/SpinnerMini";
import { UploadButton } from "@/app/api/uploadthing/upload";
// server actions
import { updateSettings } from "@/lib/actions/settingsActions";
// types
import { settingsSchema, SettingsSchema } from "@/lib/types/settingsSchema";
// lib
import { Session } from "next-auth";
import { motion } from "framer-motion";
import { getErrorMessage } from "@/lib/utils";
// assets
import { Eye, EyeOff, KeyRound, Mail, Send, Settings, UserRound } from "lucide-react";

type SettingsFormProps = {
    session: Session
}

const SettingsForm = ({ session }: SettingsFormProps) => {
    const [message, setMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { register, handleSubmit, getValues, setValue, formState: { errors, isSubmitting }, setError } = useForm<SettingsSchema>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: session.user.name!,
            email: session.user.email!,
            image: session.user.image!
        }
    });

    const onSubmit = async (data: SettingsSchema) => {
        try {
            const response = await updateSettings(data);
            if (response.success) {
                setMessage(response.message);
            } else {
                setError("root", { type: "server", message: response.message });
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setError("root", { type: "server", message: errorMessage });
        }
    }

    return (
        <div className="max-w-lg w-full mx-auto">
            <div className="flex items-center gap-1">
                <Settings className="text-blue-500 size-5" />
                <h1 className="text-xl font-semibold text-blue-500">
                    Settings
                </h1>
            </div>
            <p className="text-xs text-gray-500">Update your account settings</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2 mb-8 mt-5 space-y-3">
                    <div className="relative">
                        <input
                            {...register("name")}
                            type="text"
                            name="name"
                            placeholder="Name"
                            autoComplete="off"
                            disabled
                            className="input"
                        />
                        <UserRound className="left-input-icon" />
                        {errors.name && <p className="error mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="relative">
                        <input
                            {...register("email")}
                            type="email"
                            name="email"
                            placeholder="Email"
                            autoComplete="off"
                            disabled={isSubmitting}
                            className="input"
                        />
                        <Mail className="left-input-icon" />
                        {errors.email && <p className="error mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Current password"
                            disabled={isSubmitting || session.user.isOAuth}
                            className="input"
                        />
                        <KeyRound className="left-input-icon" />
                        {!passwordVisible ? (
                            <Eye
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="right-input-icon"
                            />) : (
                            <EyeOff
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="right-input-icon"
                            />
                        )}
                        {errors.password && <p className="error mt-1">{errors.password.message}</p>}
                    </div>
                    <div className="relative">
                        <input
                            {...register("newPassword")}
                            type={passwordVisible ? "text" : "password"}
                            name="newPassword"
                            placeholder="New password"
                            disabled={isSubmitting || session.user.isOAuth}
                            className="input"
                        />
                        <KeyRound className="left-input-icon" />
                        {!passwordVisible ? (
                            <Eye
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="right-input-icon"
                            />) : (
                            <EyeOff
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="right-input-icon"
                            />
                        )}
                        {errors.newPassword && <p className="error mt-1">{errors.newPassword.message}</p>}
                    </div>
                    <>
                        <div className="flex items-center">
                            <div className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden bg-gray-200">
                                {!getValues("image") && (
                                    <div className="font-bold">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {getValues("image") && (
                                    <Image
                                        src={getValues("image")!}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 40px"
                                        className="object-cover"
                                        alt="User Image"
                                    />
                                )}
                            </div>
                            <UploadButton
                                disabled={session.user.isOAuth}
                                className="scale-75 ut-button:bg-blue-500 hover:ut-button:bg-blue-400 ut-button:ring-blue-500 ut-button:transition-all ut-button:duration-300 ut-label:hidden ut-allowed-content:hidden"
                                endpoint="avatarUploader"
                                content={{
                                    button({ ready }) {
                                        if (ready) return <div>Change avatar</div>
                                        return <div>Loading...</div>
                                    }
                                }}
                                onUploadBegin={() => {
                                    setIsUploading(true);
                                }}
                                onUploadError={(error) => {
                                    const errorMessage = getErrorMessage(error);
                                    setError("image", { type: "validate", message: errorMessage });
                                    setIsUploading(false);
                                    return;
                                }}
                                onClientUploadComplete={(res) => {
                                    setValue("image", res[0].url);
                                    setIsUploading(false);
                                    return;
                                }}
                            />
                        </div>
                        {errors.image && <p className="error mt-1">{errors.image.message}</p>}
                    </>
                    {message && <Message message={message} type="info" />}
                    {errors.root?.type === "server" && <Message message={errors.root.message} type="error" />}
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting || isUploading}
                    className="primary-btn"
                >
                    {isSubmitting ? <SpinnerMini /> : (
                        <>
                            <span>Update settings</span>
                            <Send className="size-4 text-white" />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    )
}

export default SettingsForm;