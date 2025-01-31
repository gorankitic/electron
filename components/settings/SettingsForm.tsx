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
// types
import { settingsSchema, SettingsSchema } from "@/lib/types/settingsSchema";
// server actions
import { updateSettings } from "@/lib/actions/settingsActions";
// lib
import { Session } from "next-auth";
import { motion } from "framer-motion";
import { getErrorMessage } from "@/lib/utils";
// assets
import { Send, Settings } from "lucide-react";

type SettingsFormProps = {
    session: Session
}

const SettingsForm = ({ session }: SettingsFormProps) => {
    const [message, setMessage] = useState("");
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
            <div className="flex items-center justify-center gap-1">
                <Settings className="text-blue-500" />
                <h1 className="text-xl font-semibold text-center text-blue-500">
                    Settings
                </h1>
            </div>
            <p className="text-xs text-center text-gray-500">Update your account settings</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2 mb-8 mt-5">
                    <div>
                        <span className="text-sm">Name: </span>
                        <input
                            {...register("name")}
                            type="text"
                            name="name"
                            placeholder="Name"
                            disabled
                            className="settings-input"
                        />
                    </div>
                    <div>
                        <span className="text-sm">Email: </span>
                        <input
                            {...register("email")}
                            type="email"
                            name="email"
                            placeholder="Email"
                            disabled
                            className="settings-input"
                        />
                    </div>
                    <div>
                        <span className="text-sm">Current Password: </span>
                        <input
                            {...register("password")}
                            type="password"
                            name="password"
                            placeholder="**********"
                            autoComplete="off"
                            disabled={isSubmitting || session.user.isOAuth}
                            className="settings-input"
                        />
                        {errors.password && <p className="error mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <span className="text-sm">New password: </span>
                        <input
                            {...register("newPassword")}
                            type="password"
                            name="newPassword"
                            placeholder="**********"
                            autoComplete="off"
                            disabled={isSubmitting || session.user.isOAuth}
                            className="settings-input"
                        />
                        {errors.newPassword && <p className="error mt-1">{errors.newPassword.message}</p>}
                    </div>
                    <>
                        <span className="text-sm">Avatar:</span>
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
                            {errors.image && <p className="error mt-1">{errors.image.message}</p>}
                        </div>
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