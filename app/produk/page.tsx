import { Input } from "@/components/ui/input";
import Header from "../components/Header";
import { SwitchMode } from "../components/SwitchMode";
import { DataTable } from "./data-table";
import { columns, type Product } from "./columns";
import { DrawerAddButton } from "../components/DrawerAddButton";

async function getData(): Promise<Product[]> {
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
    ]
}

export default async function ProdukPage() {
    const data = await getData()
    return (
        <div className="min-h-screen relative">
            <Header
                page="Produk"
            />

            <div className="px-2 mt-4"><SwitchMode/></div>

            {/* table */}
            <div className="mt-4 px-2">
                <div className="mb-3"><Input placeholder="cari"/></div>
                {/* <TableProduct/> */}
                <DataTable columns={columns} data={data} />
            </div>

            {/* add button */}
            <div className="absolute right-5 bottom-24">
                <DrawerAddButton/>
            </div>
        </div>
    )
}
