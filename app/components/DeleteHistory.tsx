'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function DeleteHistory() {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                    <div className="text-white bg-white/10 p-2 rounded-md hover:bg-white/20">
                        <HugeiconsIcon icon={Delete02Icon} size={16}/>
                    </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Menghapus riwayat transaksi akan berdampak ke data stok produk dan keuangan. Apakah Anda tetap ingin menghapusnya?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="h-10 cursor-pointer bg-blue-500 text-white hover:bg-blue-500 hover:text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="h-10 cursor-pointer bg-white border border-gray-200 text-black">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
