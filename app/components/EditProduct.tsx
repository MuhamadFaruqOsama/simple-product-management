'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ProductImageUploader } from "./ProductImageUploader";
import { useForm } from "react-hook-form";
import { AddProductInput, addProductSchema, AddProductSchema } from "@/lib/validations/produtc";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormErrorMessage } from "./FormErrorMessage";
import { useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type ProductDetail = {
    uuid: string;
    name: string;
    unit: string;
    volume: string;
    sellingPrice: string | number;
    description: string;
    thumbnail: string;
};

type EditProductProps = {
    item?: ProductDetail | null;
};

export function EditProduct({ item }: EditProductProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const params = useParams()

    const form = useForm<AddProductInput, undefined, AddProductSchema>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            name: item?.name ?? "",
            unit: item?.unit ?? "",
            volume: item?.volume ?? "",
            selling_price: item?.sellingPrice ?? 0,
            description: item?.description ?? "",
            thumbnail: item?.thumbnail ?? ""
        }
    })

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = form

    async function onSubmit(data: AddProductSchema) {
        try {
            setIsLoading(true)

            const uuid = params.uuid
            const dataString = JSON.stringify(data)

            const response = await fetch(`/api/product/${uuid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: dataString
            })

            const result = await response.json()
            
            if(!result.status) {
                toast.error(result.message)
                return
            }

            setIsDialogOpen(false)
            toast.success(result.message)
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
                <div className="cursor-pointer w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm p-2.5">
                    <HugeiconsIcon icon={Edit02Icon} />
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Produk</DialogTitle>
                        <DialogDescription>
                            Anda dapat mengubah data produk dengan mengisi formulir di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 space-y-2 max-h-[70vh] overflow-y-auto">
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-name">Nama Produk</FieldLabel>
                            <Input
                                id="input-add-product-name"
                                placeholder="ex: APD"
                                type="text"
                                defaultValue={item?.name ?? ""}
                                {...register('name')}
                                required
                            />
                            {errors.name && (
                                <FormErrorMessage message={errors.name.message as string}/>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-unit">Satuan</FieldLabel>
                            <Input
                                id="input-add-product-unit"
                                placeholder="ex: pcs"
                                type="text"
                                defaultValue={item?.unit ?? ""}
                                {...register('unit')}
                                required
                            />
                            {errors.unit && (
                                <FormErrorMessage message={errors.unit.message as string}/>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-volume">Volume</FieldLabel>
                            <Input
                                id="input-add-product-volume"
                                placeholder="ex: 1,5kg"
                                type="text"
                                defaultValue={item?.volume ?? ""}
                                {...register('volume')}
                                required
                            />
                            {errors.volume && (
                                <FormErrorMessage message={errors.volume.message as string}/>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-selling-price">Harga Jual</FieldLabel>
                            <InputGroup className="h-10">
                                <InputGroupAddon>
                                    <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="ex: 5000"
                                    id="input-add-product-selling-price"
                                    type="number"
                                    min={0}
                                    defaultValue={item?.sellingPrice ?? 0}
                                    {...register('selling_price')}
                                    required
                                />
                                {errors.selling_price && (
                                    <FormErrorMessage message={errors.selling_price.message as string}/>
                                )}
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-selling-price">Deskripsi</FieldLabel>
                            <Textarea defaultValue={item?.description ?? ""} {...register('description')}></Textarea>
                            {errors.description && (
                                <FormErrorMessage message={errors.description.message as string}/>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-thumbnail">Thumbnail</FieldLabel>
                            <ProductImageUploader/>
                            {errors.thumbnail && (
                                <FormErrorMessage message={errors.thumbnail.message as string}/>
                            )}
                        </Field>
                    </div>
                    <DialogFooter>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-full bg-orange-500 py-3 rounded-md text-white disabled:bg-orange-300">
                            Simpan Perubahan
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
