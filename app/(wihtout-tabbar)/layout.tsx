import { HeaderWithBackButton } from "../components/HeaderWithBackButton";
import Header from "../components/Header";

export default function RootWithTabbarLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div className="min-h-screen">
                <div className="px-2 py-3">
                    <HeaderWithBackButton/>
                </div>
                
                <div className="px-2 pt-5 pb-20">
                    {children}
                </div>
            </div>
        </div>
    )
}