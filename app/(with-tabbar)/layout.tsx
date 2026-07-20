import { Tabbar } from "../components/Tabbar";

export default function RootWithTabbarLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
            <Tabbar/>
        </div>
    )
}