"use client";

// hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// components
import Message from "@/components/auth/Message";
import SpinnerMini from "@/components/SpinnerMini";
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
import Image from "next/image";

type SettingsFormProps = {
    session: Session
}

const SettingsForm = ({ session }: SettingsFormProps) => {
    const [message, setMessage] = useState("");

    const { register, handleSubmit, getValues, formState: { errors, isSubmitting }, setError } = useForm<SettingsSchema>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: session.user.name!,
            email: session.user.email!,
            image: session.user.image!
        }
    });

    console.log(getValues("image"))

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
        <div className="max-w-lg w-full mx-auto mt-20 py-8 px-5 bg-gray-100 bg-opacity-50 rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center justify-center gap-1">
                <Settings className="text-blue-400" />
                <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">
                    Settings
                </h1>
            </div>
            <p className="text-sm text-center text-gray-500">Update your account settings</p>
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
                    <div>
                        <span className="text-sm">Avatar:</span>
                        {!getValues("image") && (
                            <div className="font-bold border rounded-full w-10 h-10 flex items-center justify-center">
                                {session.user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {getValues("image") && (
                            <Image
                                src={getValues("image")!}
                                width={40}
                                height={40}
                                className="rounded-full"
                                alt="User Image"
                            />
                        )}
                    </div>
                    {message && <Message message={message} type="info" />}
                    {errors.root?.type === "server" && <Message message={errors.root.message} type="error" />}
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
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