'use client'

import { useMemo, useState } from "react";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
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
import { createSellProductFormSchema, SellProductFormInput } from "@/lib/validations/selling";

type LineItem = {
    id: string;
    product: string;
    quantity: string;
    sellingPrice: string;
};

type Product = {
    uuid: string;
    name: string;
    totalStock: number;
    sellingPrice: string | number;
};

export function DrawerAddButton() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [customerName, setCustomerName] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { id: "1", product: "", quantity: "1", sellingPrice: "0" },
    ]);

    const items = useMemo(() => {
        return products.map((product) => ({
            label: `${product.name} - Stok ${product.totalStock}`,
            value: product.uuid
        }))
    }, [products])

    const getProduct = async () => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/product")
            const result = await response.json()

            if (!result.status) {
                toast.error("Tidak dapat mengambil data produk")
                return
            }

            setProducts(result.data as Product[])
        } catch (error) {
            console.error(error)
            toast.error("Tidak dapat mengambil data produk. Coba lagi nanti")
        } finally {
            setIsLoading(false)
        }
    }

    const addLineItem = () => {
        setLineItems((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                product: "",
                quantity: "1",
                sellingPrice: "0",
            },
        ]);
    };

    const removeLineItem = (id: string) => {
        setLineItems((current) =>
            current.length > 1 ? current.filter((item) => item.id !== id) : current
        );
    };

    const updateLineItem = (id: string, field: keyof Omit<LineItem, "id">, value: string) => {
        setLineItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const updateProductLineItem = (id: string, productUuid: string) => {
        const product = products.find((product) => product.uuid === productUuid)

        setLineItems((current) =>
            current.map((item) =>
                item.id === id ? {
                    ...item,
                    product: productUuid,
                    sellingPrice: String(product?.sellingPrice ?? 0)
                } : item
            )
        );
    };

    const resetForm = () => {
        setCustomerName("")
        setLineItems([{ id: "1", product: "", quantity: "1", sellingPrice: "0" }])
    }

    const onSubmit = async () => {
        try {
            setIsSubmitting(true)

            const body: SellProductFormInput = {
                name: customerName,
                data: lineItems.map((lineItem) => ({
                    uuid: lineItem.product,
                    quantity: Number(lineItem.quantity),
                    selling_price: Number(lineItem.sellingPrice)
                }))
            }

            const validation = createSellProductFormSchema(
                products.map((product) => ({
                    uuid: product.uuid,
                    stock: product.totalStock
                }))
            ).safeParse(body)

            if (!validation.success) {
                toast.error(validation.error.issues.map((issue) => issue.message).join(", "))
                return
            }

            const response = await fetch("/api/sell", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(validation.data)
            })

            const result = await response.json()
            if (!result.status) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            resetForm()
            setIsDialogOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Terjadi masalah pada sisi server. Coba lagi nanti")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open)

        if (open) {
            void getProduct()
        }
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger>
                <div className="cursor-pointer w-14 h-14 rounded-full text-sm bg-linear-to-tr from-orange-500 to-yellow-500 hover:bg-orange-600 duration-300 transition-all text-white font-medium flex items-center justify-center">
                    <HugeiconsIcon icon={Add01Icon} size={40} strokeWidth={2}/>
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
                <DialogHeader>
                    <DialogTitle>Tambah Penjualan Produk</DialogTitle>
                    <DialogDescription>
                        Anda dapat menambah penjualan produk lebih dari 1 produk sekaligus menggunakan menu ini.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    placeholder="Nama pelanggan"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                />
                <div className="py-2 space-y-2 max-h-[50vh] overflow-y-auto">
                    {lineItems.map((lineItem, index) => (
                        <div key={index} className="border p-1.5 border-gray-200 bg-gray-100 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <div className="text-xs">{index+1}.</div>
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
                                        placeholder={isLoading ? "Memuat barang..." : "Pilih barang"}
                                        searchPlaceholder="Cari barang..."
                                        emptyText="Barang tidak ditemukan"
                                        className="bg-white"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Input
                                        className="w-full bg-white"
                                        placeholder="Jumlah"
                                        type="number"
                                        min={1}
                                        value={lineItem.quantity}
                                        onChange={(event) => updateLineItem(lineItem.id, "quantity", event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        className="w-full bg-white"
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

                    {/* button */}
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={addLineItem} className="p-1 rounded bg-blue-500 text-white">
                            <HugeiconsIcon icon={Add01Icon} size={20} strokeWidth={2.5}/>
                        </button>
                    </div>
                </div>
                <DialogFooter>
                    <button
                        type="button"
                        className="w-full h-full bg-orange-500 py-3 rounded-md text-white disabled:opacity-60"
                        disabled={isSubmitting || isLoading}
                        onClick={onSubmit}
                    >
                        {isSubmitting ? "Menambahkan..." : "Tambah Penjualan"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
