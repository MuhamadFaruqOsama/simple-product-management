import { Input } from "@/components/ui/input";
import Header from "../components/Header";
import { RiwayatCard } from "../components/RiwayatCard";

export default function RiwayatPage() {
    return (
        <div className="min-h-screen">
            <Header
                page="Riwayat"
            />

            {/* search */}
            <div className="mt-5 px-2">
                <Input placeholder="cari"/>

                <div className="mt-3 space-y-2">
                    <RiwayatCard/>
                </div>
            </div>
        </div>
    )
}