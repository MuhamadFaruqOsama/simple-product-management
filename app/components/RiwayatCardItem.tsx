'use client'

import { forwardRef } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditHistory } from "./EditHistory";
import { DeleteHistory } from "./DeleteHistory";
import { PrintHistory } from "./PrintHistory";

export type RiwayatItem = {
    id: string;
    is_restock: boolean;
    date: string;
    nama_produk: string;
    amount: number;
};

type RiwayatCardItemProps = {
    item: RiwayatItem;
    onPrint: () => void;
};

export const RiwayatCardItem = forwardRef<HTMLDivElement, RiwayatCardItemProps>(
    function RiwayatCardItem({ item, onPrint }, ref) {
        return (
            <div ref={ref} className="bg-white border border-gray-200 rounded-md overflow-hidden mb-2 print:break-inside-avoid print:shadow-none">
                <div className="border-b last:border-b-0">
                    <div className={`flex justify-between overflow-hidden items-center px-3 py-2 relative ${item.is_restock ? "bg-blue-500" : "bg-orange-500"}`}>
                        <h3 className="font-bold text-white">#2312</h3>
                        <div className="flex justify-end gap-2 items-center print:hidden">
                            <div className="p-1 rounded-md text-white text-sm">
                                {item.is_restock ? "Pengadaan" : "Penjualan"}
                            </div>

                            <EditHistory />
                            <DeleteHistory />
                            <PrintHistory onPrint={onPrint} />
                        </div>

                        <div className="absolute bg-white/10 h-40 w-40 rounded-full -left-6 -bottom-28"></div>
                    </div>
                    <div className="pt-2 border-t px-3 py-2 space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="text-start text-sm text-gray-600">Tanggal</div>
                            <div className="text-start text-gray-800">{item.date}</div>
                        </div>
                        <div>
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
                    </div>
                </div>
            </div>
        );
    }
);

RiwayatCardItem.displayName = "RiwayatCardItem";
