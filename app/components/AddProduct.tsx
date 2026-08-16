'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { ProductImageUploader } from "./ProductImageUploader";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductFormSchema, type AddProductFormInput, type AddProductFormSchema } from "@/lib/validations/produtc";
import { FormErrorMessage } from "./FormErrorMessage";
import { useState } from "react";
import { toast } from "sonner";

export function AddProduct() {
    const [isLoading, setIsLoading] = useState(false)
    
    const form = useForm<AddProductFormInput, undefined, AddProductFormSchema>({
        resolver: zodResolver(addProductFormSchema),
        defaultValues: {
            name: "",
            unit: "",
            volume: "",
            selling_price: 0,
            quantity: 0,
            purchase_price: 0,
            description: "",
            thumbnail: ""
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = form

    const onSubmit = async (data: AddProductFormSchema) => {
        try {
            setIsLoading(true)
            
            const dataString = JSON.stringify(data)

            const response = await fetch("/api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: dataString
            })

            const result = await response.json()

            if(!result.status) {
                toast.error(result.message)
                setIsLoading(false)
                return
            }

            console.log(result.message)
            
            toast.success(result.message)
            setIsLoading(false)
            reset()
            
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan dari sisi server. Coba lagi nanti" )
            setIsLoading(false)
            return
        }
    }
    
    return (
        <Dialog>
            <DialogTrigger>
                <div className="px-5 cursor-pointer py-2 text-sm text-white bg-blue-500 rounded-sm">
                    tambah produk
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
                <DialogHeader>
                    <DialogTitle>Tambah Produk</DialogTitle>
                    <DialogDescription>
                        Anda dapat menambah produk baru dengan mengisi formulir di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="py-2 space-y-2 max-h-[70vh] overflow-y-auto">
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-name">Nama Produk</FieldLabel>
                            <Input 
                                id="input-add-product-name"
                                placeholder="ex: APD"
                                type="text"
                                {...register("name")}
                            />
                            {errors.name && (
                                <FormErrorMessage message={errors.name.message as string} />
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-unit">Satuan</FieldLabel>
                            <Input 
                                id="input-add-product-unit"
                                placeholder="ex: pcs"
                                type="text"
                                {...register("unit")}
                            />
                            {errors.unit && (
                                <FormErrorMessage message={errors.unit.message as string} />
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
                                    min={0}
                                
                                step="any"
                                {...register("purchase_price")}
                            />
                                {errors.purchase_price && (
                                    <FormErrorMessage message={errors.purchase_price.message as string} />
                                )}
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-stock">Stok</FieldLabel>
                            <Input 
                                id="input-add-product-stock"
                                placeholder="ex: 50"
                                type="number"
                                min={0}
                                step="any"
                                {...register("quantity")}
                            />
                                {errors.quantity && (
                                    <FormErrorMessage message={errors.quantity.message as string} />
                                )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-volume">Volume</FieldLabel>
                            <Input 
                                id="input-add-product-volume"
                                placeholder="ex: 1,5kg"
                                type="text"
                                
                                {...register('volume')}
                            />

                            {errors.volume && (
                                <FormErrorMessage message={errors.volume.message as string} />
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
                                    {...register('selling_price')}
                                />
                                {errors.selling_price && (
                                    <FormErrorMessage message={errors.selling_price.message as string} />
                                )}
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-description">Deskripsi</FieldLabel>
                            <Textarea 
                            id="input-add-product-description"
                            {...register('description')}
                            ></Textarea>
                            {errors.description && (
                                <FormErrorMessage message={errors.description.message as string} />
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-gray-600" htmlFor="input-add-product-thumbnail">Thumbnail</FieldLabel>
                            <ProductImageUploader/>
                            {errors.thumbnail && (
                                <FormErrorMessage message={errors.thumbnail.message as string} />
                            )}
                        </Field>
                    </div>
                    <DialogFooter>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-full bg-blue-500 py-3 rounded-md text-white disabled:bg-blue-300">
                            Tambahkan
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}