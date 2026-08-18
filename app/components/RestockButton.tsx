"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { addProductStockSchema, type AddProductStockInput, type AddProductStockSchema } from "@/lib/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBasketAdd03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { FormErrorMessage } from "./FormErrorMessage";
import { toast } from "sonner";
import { useState } from "react";
import { useParams } from "next/navigation";

type RestockButtonProps = {
    purchasePrice: number;
    onRestocked?: (product: any) => void
}

export function RestockButton({
    purchasePrice,
    onRestocked
} : RestockButtonProps
) {
    const params = useParams<{ uuid: string }>()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<AddProductStockInput, undefined, AddProductStockSchema>({
        resolver: zodResolver(addProductStockSchema),
        defaultValues: {
            quantity: 0,
            purchase_price: purchasePrice
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = form

    const onSubmit = async (data: AddProductStockSchema) => {
        try {
            setIsLoading(true)
            const dataString = JSON.stringify(data)

            const uuid = params.uuid
            
            const response = await fetch(`/api/product/restock/${uuid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: dataString
            })

            const result = await response.json()

            console.log(result)
            
            if(!result.status) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            onRestocked?.(result.data)
            setIsDialogOpen(false)
            reset()
            
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan dari sisi server. Coba lagi nanti")
            return
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
                <div className="cursor-pointer w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm p-2.5">
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-stock-product">Tambahkan Stok</FieldLabel>
                            <Input
                                id="input-stock-product"
                                placeholder="ex: 20"
                                type="number"
                                {...register('quantity')}
                                required
                            />
                            {errors.quantity && (
                                <FormErrorMessage message={errors.quantity.message as string}/>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-buying-price">Harga Beli</FieldLabel>
                            <InputGroup className="h-10">
                                <InputGroupAddon>
                                    <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="ex: 5000"
                                    id="input-add-product-buying-price"
                                    type="number"
                                    defaultValue={purchasePrice}
                                    min={0}
                                    {...register('purchase_price')}
                                    required
                                />
                            </InputGroup>
                            {errors.purchase_price && (
                                <FormErrorMessage message={errors.purchase_price.message as string}/>
                            )}
                        </Field>
                        <DialogFooter>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-full bg-orange-500 py-3 rounded-md text-white disabled:bg-orange-300">
                                Tambahkan ke dalam stok
                            </button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
