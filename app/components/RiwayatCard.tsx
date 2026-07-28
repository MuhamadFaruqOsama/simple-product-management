import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditHistory } from "./EditHistory";
import { DeleteHistory } from "./DeleteHistory";
import { PrintHistory } from "./PrintHistory";

const dummyData = [
    {
        is_restock: true,
        date: "26 May 2026",
        nama_produk: "APD",
        amount: 500
    },
    {
        is_restock: false,
        date: "27 May 2026",
        nama_produk: "Masker Medis",
        amount: 120
    },
    {
        is_restock: true,
        date: "28 May 2026",
        nama_produk: "Hand Sanitizer",
        amount: 300
    },
    {
        is_restock: false,
        date: "29 May 2026",
        nama_produk: "Sarung Tangan Latex",
        amount: 80
    },
    {
        is_restock: true,
        date: "30 May 2026",
        nama_produk: "Face Shield",
        amount: 150
    },
    {
        is_restock: false,
        date: "31 May 2026",
        nama_produk: "Termometer Digital",
        amount: 25
    },
    {
        is_restock: true,
        date: "01 Jun 2026",
        nama_produk: "Tabung Oksigen",
        amount: 40
    },
    {
        is_restock: false,
        date: "02 Jun 2026",
        nama_produk: "Infus Set",
        amount: 65
    },
    {
        is_restock: true,
        date: "03 Jun 2026",
        nama_produk: "Syringe 5 ml",
        amount: 1000
    },
    {
        is_restock: false,
        date: "04 Jun 2026",
        nama_produk: "Kasa Steril",
        amount: 200
    }
];

export function RiwayatCard() {
    return (
        <div>
            {
                dummyData.map((item, index) => (
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-2" key={index}>
                        <div className="border-b last:border-b-0">
                            <div className={`flex justify-between overflow-hidden items-center px-3 py-2 relative ${item.is_restock ? "bg-blue-500" : "bg-orange-500"}`}>
                                <h3 className="font-bold text-white">#2312</h3>
                                <div className="flex justify-end gap-2 items-center">
                                    <div className="p-1 rounded-md text-white text-sm">
                                        {item.is_restock ? "Pengadaan" : "Penjualan"}
                                    </div>

                                    <EditHistory/>
                                    <DeleteHistory/>
                                    <PrintHistory/>
                                </div>

                                <div className="absolute bg-white/10 h-40 w-40 rounded-full -left-6 -bottom-28"></div>
                            </div>
                            <div className="pt-2 border-t px-3 py-2 space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="text-start text-sm text-gray-600">Tanggal</div>
                                    <div className="text-start text-gray-800">{item.date}</div>
                                </div>
                                <div className="">
                                    <div className="text-start text-sm text-gray-600">Daftar Produk</div>
                                    <Table className="border rounded-md">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-1/2 text-start font-semibold">Nama</TableHead>
                                                <TableHead className="w-1/2 text-start font-semibold">Jumlah</TableHead>
                                                <TableHead className="w-1/2 text-end font-semibold">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                                    {item.nama_produk}
                                                </TableCell>
                                                <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                                    {item.amount}   
                                                </TableCell>
                                                <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                                    Rp300.000
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                                    Total
                                                </TableCell>
                                                <TableCell>
                                                    90
                                                </TableCell>
                                                <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                                    Rp900.0000
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                                {/* <div className="flex justify-between items-end">
                                    <div className="text-start text-sm text-gray-600">Jumlah {item.is_restock ? "Pengeluaran" : "Pemasukkan"}</div>
                                    <div className="text-start text-gray-800">{item.amount}</div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}