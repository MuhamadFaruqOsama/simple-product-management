export default function RootWithTabbarLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex-1 flex flex-col">
            {children}
        </div>
    )
}