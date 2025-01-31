// hooks
import { redirect } from "next/navigation";
// lib
import { auth } from "@/lib/auth";
// components
import SettingsForm from "@/components/settings/SettingsForm";

const Settings = async () => {
    const session = await auth();
    if (!session) redirect("/signin");

    return <SettingsForm session={session} />
}

export default Settings;