import { Add01Icon } from "@hugeicons/core-free-icons";
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

export function DrawerAddButton() {
    return (
        <Dialog>
            <DialogTrigger>
                <div className="w-14 h-14 rounded-full text-sm bg-blue-500 hover:bg-blue-600 duration-300 transition-all text-white font-medium flex items-center justify-center">
                    <HugeiconsIcon icon={Add01Icon} size={40} strokeWidth={2}/>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Produk</DialogTitle>
                    <DialogDescription>
                        Masukkan detail produk yang ingin ditambahkan.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 space-y-2">
                    <Input placeholder="nama produk"/>
                    <Input placeholder="harga satuan"/>
                </div>
                <DialogFooter className="text-white font-medium p-0 overflow-hidden">
                    <button className="w-full h-full bg-blue-500 py-4">
                        Tambah
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}