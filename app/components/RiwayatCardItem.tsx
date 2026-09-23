'use client'

import { forwardRef } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditHistory } from "./EditHistory";
import { DeleteHistory } from "./DeleteHistory";
import { PrintHistory } from "./PrintHistory";

export type RiwayatItem = {
    id: string;
    is_restock: boolean;
    date: string | Date;
    customerName: string | null;
    storeName: string;
    products: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    totalQuantity: number;
    totalAmount: number;
};

type RiwayatCardItemProps = {
    item: RiwayatItem;
    onUpdated: () => void;
    onDeleted: () => void;
};

export const RiwayatCardItem = forwardRef<HTMLDivElement, RiwayatCardItemProps>(
    function RiwayatCardItem({ item, onUpdated, onDeleted }, ref) {
        const date = new Date(item.date)
        const formattedDate = Number.isNaN(date.getTime())
            ? "-"
            : new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(date)
        const formattedTime = Number.isNaN(date.getTime())
            ? "-"
            : new Intl.DateTimeFormat("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
            }).format(date)

        return (
            <div ref={ref} className="bg-white border border-gray-200 rounded-md overflow-hidden mb-2 print:break-inside-avoid print:shadow-none">
                <div className="border-b last:border-b-0">
                    <div className={`flex justify-between overflow-hidden items-center px-3 py-2 relative ${item.is_restock ? "bg-blue-500" : "bg-orange-500"}`}>
                        <h3 className="font-bold text-white">#{item.id}</h3>
                        <div className="flex justify-end gap-2 items-center print:hidden">
                            <div className="p-1 rounded-md text-white text-sm">
                                {item.is_restock ? "Pengadaan" : "Penjualan"}
                            </div>

                            {!item.is_restock && (
                                <EditHistory 
                                    item={item}
                                    onUpdated={onUpdated}
                                />
                            )}
                            <DeleteHistory id={item.id} isRestock={item.is_restock} onDeleted={onDeleted} />
                            <PrintHistory item={item} />
                        </div>

                        <div className="absolute bg-white/10 h-40 w-40 rounded-full -left-6 -bottom-28"></div>
                    </div>
                    <div className="pt-2 border-t px-3 py-2 space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="text-start text-sm text-gray-600">Tanggal</div>
                            <div className="text-start text-gray-800">{formattedDate}</div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="text-start text-sm text-gray-600">Waktu</div>
                            <div className="text-start text-gray-800">{formattedTime}</div>
                        </div>
                        {
                            !item.is_restock && (
                                <div className="flex justify-between items-end">
                                    <div className="text-start text-sm text-gray-600">Nama</div>
                                    <div className="text-start text-gray-800">{item.customerName || "-"}</div>
                                </div>
                            )
                        }
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
                                    {item.products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                                {Number(product.quantity).toLocaleString("id-ID")}
                                            </TableCell>
                                            <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word text-end">
                                                {Number(product.total).toLocaleString("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR"
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word">
                                            Total
                                        </TableCell>
                                        <TableCell>
                                            {Number(item.totalQuantity).toLocaleString("id-ID")}
                                        </TableCell>
                                        <TableCell className="w-1/2 align-top whitespace-normal wrap-break-word text-end">
                                            {Number(item.totalAmount).toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR"
                                            })}
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
