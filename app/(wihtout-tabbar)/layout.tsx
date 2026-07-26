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
                
                {children}
            </div>
        </div>
    )
}