import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function EditProduct() {
    return (
        <Dialog>
            <DialogTrigger>
                <div onClick={() => {}} className="cursor-pointer w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm p-2.5">
                    <HugeiconsIcon icon={Edit02Icon} />
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
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
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel className="text-gray-600" htmlFor="input-add-product-unit">Satuan</FieldLabel>
                        <Input 
                            id="input-add-product-unit"
                            placeholder="ex: pcs"
                            type="text"
                            required
                        />
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
                                required 
                            />
                        </InputGroup>
                    </Field>
                    <Field>
                        <FieldLabel className="text-gray-600" htmlFor="input-add-product-volume">Volume</FieldLabel>
                        <Input 
                            id="input-add-product-volume"
                            placeholder="ex: 1,5kg"
                            type="text"
                            required
                        />
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
                                required 
                            />
                        </InputGroup>
                    </Field>
                    <Field>
                        <FieldLabel className="text-gray-600" htmlFor="input-add-product-selling-price">Deskripsi</FieldLabel>
                        <Textarea></Textarea>
                    </Field>
                </div>
                <DialogFooter>
                    <button className="w-full h-full bg-orange-500 py-3 rounded-md text-white">
                        Simpan Perubahan
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}