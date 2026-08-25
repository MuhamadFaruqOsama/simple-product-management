import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { createSellProductFormSchema, SellProductFormInput } from "@/lib/validations/selling";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FormErrorMessage } from "./FormErrorMessage";
import { useState } from "react";

const placeholderImage =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Cpath d='M120 250l48-52 38 38 28-30 46 44' fill='none' stroke='%239ca3af' stroke-width='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='160' cy='155' r='18' fill='%239ca3af'/%3E%3C/svg%3E";

type Product = {
    uuid: string,
    name: string,
    stock: number,
    thumbnail: string,
    sellingPrice: number
};
    
export function ProductCard(data: Product) {
    const [isLoading, setIsLoading] = useState(false)
    const schema = createSellProductFormSchema(data.stock)
    
    const form = useForm<SellProductFormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            quantity: 1,
            selling_price: data.sellingPrice
        }
    })
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = form

    const onSubmit = (formData: SellProductFormInput) => {
        console.log(formData)
    }
    
    return (
        <>
        <Dialog>
            <DialogTrigger>
                {/*  */}
                <div className="bg-white p-2 rounded-lg shadow-sm cursor-pointer">
                    {/* image */}
                    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                        <Image
                            src={data.thumbnail ? data.thumbnail : placeholderImage}
                            alt="placeholder"
                            fill
                            style={{ objectFit: 'cover' }} // Agar gambar tidak terdistorsi/gepeng
                        />
                    </div>
                
                    {/* details */}
                    <div className="flex flex-col gap-1 mt-2">
                        <div className="text-md line-clamp-1 text-start">{data.name}</div>
                        <div className="flex justify-between items-end">
                            <div className="text-sm text-gray-600">Stok</div>
                            <div className="">{data.stock}</div>
                        </div>
                    </div>
                    {/* detail */}
                    <Link href={`produk/${data.uuid}`}>
                        <div className="w-full text-center flex items-center gap-1 justify-center p-2 rounded-md text-sm mt-3 border border-gray-300 hover:bg-blue-500 transition-all duration-300 hover:text-white cursor-pointer">
                            Detail
                            <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2}/>
                        </div>
                    </Link>
                </div>
                {/*  */}
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Tambah Penjualan Produk</DialogTitle>
                        <DialogDescription>Nama Produk: {data.name}</DialogDescription>
                    </DialogHeader>
                    {
                        data.stock <= 0 ? 
                        (
                            <div className="text-center my-5">
                                Stok Produk Ini Habis. Segera perbarui stok di menu detail produk atau klik tombol dibawah
                            </div>
                        ) :
                        (
                            <div className="py-2 space-y-2">
                                <Field>
                                    <FieldLabel className="text-gray-600" htmlFor="input-customer-name">Nama</FieldLabel>
                                    <InputGroup className="h-10">
                                        <InputGroupInput
                                            placeholder="ex: mamang"
                                            id="input-customer-name"
                                            type="text"
                                            required
                                            {...register("name")}
                                        />
                                        {errors.name && (
                                            <FormErrorMessage message={errors.name.message as string} />
                                        )}
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel className="text-gray-600" htmlFor="input-quantity">Jumlah</FieldLabel>
                                    <InputGroup className="h-10">
                                        <InputGroupInput
                                            placeholder="ex: 5000"
                                            id="input-quantity"
                                            type="number"
                                            max={data.stock}
                                            min={1}
                                            required
                                            {...register("quantity")}
                                        />
                                        {errors.quantity && (
                                            <FormErrorMessage message={errors.quantity.message as string} />
                                        )}
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel className="text-gray-600" htmlFor="input-selling-price">Harga Jual</FieldLabel>
                                    <InputGroup className="h-10">
                                        <InputGroupAddon>
                                            <InputGroupText>Rp</InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            placeholder="ex: 5000"
                                            id="input-selling-price"
                                            type="number"
                                            min={0}
                                            step="any"
                                            defaultValue={data.sellingPrice}
                                            {...register("selling_price")}
                                        />
                                        {errors.selling_price && (
                                            <FormErrorMessage message={errors.selling_price.message as string} />
                                        )}
                                    </InputGroup>
                                </Field>
                            </div>
                        )
                    }
                    <DialogFooter>
                        {
                            data.stock <= 0 ? 
                            (
                                <Link 
                                    href={`produk/${data.uuid}`} 
                                    className="w-full text-center h-full bg-orange-500 py-3 rounded-md text-white">
                                    Perbarui Stok
                                </Link>
                            )
                            :
                            (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-full bg-orange-500 py-3 rounded-md text-white">
                                    Tambah Penjualan
                                </button>
                            )
                        }
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )
}
