"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteProduct() {
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const params = useParams<{uuid: string}>()
    const router = useRouter()
    
    const handleDeleteProduct = async () => {
        try {
            setIsLoading(true)

            const uuid = params.uuid
            
            const response = await fetch(`/api/product/${uuid}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const result = await response.json()

            if(!result.status) {
                toast.error("Gagal menghapus produk")
                return
            }

            toast.success("Produk berhasil dihapus")
            setIsDialogOpen(false)
            router.push("/produk")
            return
            
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan pada sisi server. Coba lagi nanti")
            return
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    <AlertDialogAction 
                        onClick={(e) => {
                            e.preventDefault()
                            handleDeleteProduct()
                        }}
                        disabled={isLoading}
                        className="h-10 cursor-pointer bg-white border border-gray-200 text-black">
                            {isLoading ? "Menghapus..." : "Continue"}
                        </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}