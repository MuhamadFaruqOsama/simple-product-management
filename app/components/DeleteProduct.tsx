import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function DeleteProduct() {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div onClick={() => {}} className="cursor-pointer w-10 h-10 text-red-700 rounded-full bg-red-100 flex items-center justify-center border border-gray-100 shadow-sm p-2.5">
                    <HugeiconsIcon icon={Delete02Icon} />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Menghapus produk akan berdampak ke data transaksi dan keuangan. Apakah Anda tetap ingin menghapusnya?
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