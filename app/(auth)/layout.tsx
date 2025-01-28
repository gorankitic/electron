export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen flex-col justify-between">
            {children}
        </div>
    );
}
