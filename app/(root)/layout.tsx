// components
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen flex-col lg:mx-auto">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
