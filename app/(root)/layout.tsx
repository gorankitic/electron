// components
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen flex-col max-w-7xl lg:mx-auto md:px-10 w-full px-5">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
