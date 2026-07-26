import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ShoppingBasketAdd03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function RestockButton() {
    return (
        <Dialog>
            <DialogTrigger>
                <div onClick={() => {}} className="cursor-pointer w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm p-2.5">
                    <HugeiconsIcon icon={ShoppingBasketAdd03Icon} />
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
                <DialogHeader>
                    <DialogTitle>Tambah stok produk</DialogTitle>
                    <DialogDescription>
                        Jumlah yang Anda masukkan akan ditambahkan ke dalam stok
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 space-y-2">
                    <Field>
                        <FieldLabel htmlFor="input-stock-product">Tambahkan Stok</FieldLabel>
                        <Input 
                            id="input-stock-product"
                            placeholder="ex: 20"
                            type="number"
                            required
                        />
                    </Field>
                </div>
                <DialogFooter>
                    <button className="w-full h-full bg-orange-500 py-3 rounded-md text-white">
                        Tambahkan ke dalam stok
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}