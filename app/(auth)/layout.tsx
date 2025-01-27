// components
import Footer from "@/components/Footer";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen flex-col justify-between max-w-7xl mx-auto px-5 md:px-10">
            {children}
            <Footer />
        </div>
    );
}
