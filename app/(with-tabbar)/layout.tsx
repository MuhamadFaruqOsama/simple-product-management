import Header from "../components/Header";
import { Tabbar } from "../components/Tabbar";

export default function RootWithTabbarLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div className="min-h-screen">
                <Header/>
                
                {children}
            </div>
            <Tabbar/>
        </div>
    )
}