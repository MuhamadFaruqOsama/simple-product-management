'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteHistoryProps = {
    id: string;
    onDeleted: () => void;
};

export function DeleteHistory({ id, onDeleted }: DeleteHistoryProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [returnToStock, setReturnToStock] = useState(true)

    const onDelete = async () => {
        try {
            setIsLoading(true)

            const params = new URLSearchParams({
                id,
                returnToStock: String(returnToStock)
            })

            const response = await fetch(`/api/history?${params.toString()}`, {
                method: "DELETE"
            })
            const result = await response.json()

            if (!result.status) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            onDeleted()
        } catch (error) {
            console.error(error)
            toast.error("Terjadi masalah pada sisi server. Coba lagi nanti")
        } finally {
            setIsLoading(false)
        }
    }

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
                    <label className="flex items-center gap-2 text-sm text-gray-700 pt-2">
                        <input
                            type="checkbox"
                            checked={returnToStock}
                            onChange={(event) => setReturnToStock(event.target.checked)}
                        />
                        Kembalikan ke stok produk
                    </label>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="h-10 cursor-pointer bg-blue-500 text-white hover:bg-blue-500 hover:text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={onDelete}
                        className="h-10 cursor-pointer bg-white border border-gray-200 text-black"
                    >
                        {isLoading ? "Menghapus..." : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
