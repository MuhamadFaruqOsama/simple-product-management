'use client'

import { useState } from "react";
import { Add01Icon, Edit02Icon, MinusSignIcon } from "@hugeicons/core-free-icons";
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

type LineItem = {
    id: string;
    product: string;
    quantity: string;
};

export function EditHistory() {

    const items = [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "System", value: "system" },
        ]
    
        const [lineItems, setLineItems] = useState<LineItem[]>([
            { id: "1", product: "", quantity: "1" },
        ]);
    
        const addLineItem = () => {
            setLineItems((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    product: "",
                    quantity: "1",
                },
            ]);
        };
    
        const removeLineItem = () => {
            setLineItems((current) => (current.length > 1 ? current.slice(0, -1) : current));
        };
    
        const updateLineItem = (id: string, field: keyof Omit<LineItem, "id">, value: string) => {
            setLineItems((current) =>
                current.map((item) =>
                    item.id === id ? { ...item, [field]: value } : item
                )
            );
        };
    
    return (
        <Dialog>
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
                <div className="py-2 space-y-2 max-h-[70vh] overflow-y-auto">
                    {lineItems.map((lineItem, index) => (
                        <div key={index} className="border p-1.5 border-gray-200 rounded">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <Combobox
                                        items={items}
                                        value={lineItem.product}
                                        onValueChange={(value) => updateLineItem(lineItem.id, "product", value)}
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
                            </div>
                        </div>
                    ))}

                    {/* button */}
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={removeLineItem} className="p-1 rounded border border-gray-300">
                            <HugeiconsIcon icon={MinusSignIcon} size={20} strokeWidth={2.5}/>
                        </button>
                        <button onClick={addLineItem} className="p-1 rounded bg-blue-500 text-white">
                            <HugeiconsIcon icon={Add01Icon} size={20} strokeWidth={2.5}/>
                        </button>
                    </div>
                </div>
                <DialogFooter>
                    <button className="w-full h-full bg-orange-500 py-3 rounded-md text-white">
                        Simpan perubahan
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}