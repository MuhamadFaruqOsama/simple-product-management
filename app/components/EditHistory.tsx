'use client'

import { useState } from "react";
import { Add01Icon, Cancel01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { type RiwayatItem } from "./RiwayatCardItem";

type LineItem = {
    id: string;
    listSellProductId: number;
    product: string;
    quantity: string;
    sellingPrice: string;
};

type EditHistoryProps = {
    item: RiwayatItem;
    onUpdated: () => void;
};

export function EditHistory({ item, onUpdated }: EditHistoryProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [customerName, setCustomerName] = useState(item.customerName || "")
    const [returnToStock, setReturnToStock] = useState(true)
    const [lineItems, setLineItems] = useState<LineItem[]>(
        item.products.map((product) => ({
            id: String(product.id),
            listSellProductId: product.id,
            product: String(product.id),
            quantity: String(product.quantity),
            sellingPrice: String(product.price)
        }))
    )

    const items = item.products.map((product) => ({
        label: product.name,
        value: String(product.id)
    }))

    const updateLineItem = (id: string, field: keyof Omit<LineItem, "id">, value: string) => {
        setLineItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const updateProductLineItem = (id: string, value: string) => {
        setLineItems((current) =>
            current.map((item) =>
                item.id === id ? {
                    ...item,
                    product: value,
                    listSellProductId: Number(value)
                } : item
            )
        );
    };

    const addLineItem = () => {
        const firstProduct = item.products[0]
        if (!firstProduct) {
            return
        }

        setLineItems((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                listSellProductId: firstProduct.id,
                product: String(firstProduct.id),
                quantity: "1",
                sellingPrice: String(firstProduct.price)
            }
        ])
    }

    const removeLineItem = (id: string) => {
        setLineItems((current) =>
            current.length > 1 ? current.filter((item) => item.id !== id) : current
        )
    }

    const onSubmit = async () => {
        try {
            setIsSubmitting(true)

            const response = await fetch("/api/history", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: item.id,
                    name: customerName,
                    returnToStock,
                    data: lineItems.map((lineItem) => ({
                        listSellProductId: lineItem.listSellProductId,
                        quantity: Number(lineItem.quantity),
                        selling_price: Number(lineItem.sellingPrice)
                    }))
                })
            })

            const result = await response.json()
            if (!result.status) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            setIsDialogOpen(false)
            onUpdated()
        } catch (error) {
            console.error(error)
            toast.error("Terjadi masalah pada sisi server. Coba lagi nanti")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
                <div className="text-white bg-white/10 p-2 rounded-md hover:bg-white/20">
                    <HugeiconsIcon icon={Edit02Icon} size={16}/>
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
                <DialogHeader>
                    <DialogTitle>Edit Riwayat Penjualan</DialogTitle>
                    <DialogDescription>
                        Perubahan riwayat akan berdampak pada penjumlahan keuangan.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    placeholder="Nama pelanggan"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                />
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={returnToStock}
                        onChange={(event) => setReturnToStock(event.target.checked)}
                    />
                    Kembalikan ke stok produk
                </label>
                <div className="py-2 space-y-2 max-h-[70vh] overflow-y-auto">
                    {lineItems.map((lineItem, index) => (
                        <div key={lineItem.id} className="border p-1.5 border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                                <div className="text-xs">{index + 1}.</div>
                                {lineItems.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLineItem(lineItem.id)}
                                    >
                                        <HugeiconsIcon size={15} strokeWidth={2} icon={Cancel01Icon} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <Combobox
                                        items={items}
                                        value={lineItem.product}
                                        onValueChange={(value) => updateProductLineItem(lineItem.id, value)}
                                        placeholder="Pilih barang"
                                        searchPlaceholder="Cari barang..."
                                        emptyText="Barang tidak ditemukan"
                                    />
                                </div>
                                <Input
                                    className="w-full"
                                    placeholder="Jumlah"
                                    type="number"
                                    min={1}
                                    value={lineItem.quantity}
                                    onChange={(event) => updateLineItem(lineItem.id, "quantity", event.target.value)}
                                    required
                                />
                                <div className="col-span-3">
                                    <Input
                                        className="w-full"
                                        placeholder="Harga"
                                        type="number"
                                        min={0}
                                        step="any"
                                        value={lineItem.sellingPrice}
                                        onChange={(event) => updateLineItem(lineItem.id, "sellingPrice", event.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button type="button" onClick={addLineItem} className="p-1 rounded bg-blue-500 text-white">
                            <HugeiconsIcon icon={Add01Icon} size={20} strokeWidth={2.5}/>
                        </button>
                    </div>
                </div>
                <DialogFooter>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onSubmit}
                        className="w-full h-full bg-orange-500 py-3 rounded-md text-white disabled:opacity-60"
                    >
                        {isSubmitting ? "Menyimpan..." : "Simpan perubahan"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
