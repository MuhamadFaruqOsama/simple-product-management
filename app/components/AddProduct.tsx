import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";

export function AddProduct() {
    return (
        <Dialog>
            <DialogTrigger>
                <div className="px-5 cursor-pointer py-2 text-sm text-white bg-blue-500 rounded-sm mt-3">
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
                <div className="py-2 space-y-2">
                    <Field>
                        <FieldLabel htmlFor="input-add-product-name">Nama Produk</FieldLabel>
                        <Input 
                            id="input-add-product-name"
                            placeholder="ex: APD"
                            type="text"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="input-add-product-unit">Satuan</FieldLabel>
                        <Input 
                            id="input-add-product-unit"
                            placeholder="ex: pcs"
                            type="text"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="input-add-product-buying-price">Harga Beli</FieldLabel>
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
                        <FieldLabel htmlFor="input-add-product-stock">Stok</FieldLabel>
                        <Input 
                            id="input-add-product-stock"
                            placeholder="ex: 50"
                            type="number"
                            min={0}
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="input-add-product-volume">Volume</FieldLabel>
                        <Input 
                            id="input-add-product-volume"
                            placeholder="ex: 1,5kg"
                            type="text"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="input-add-product-selling-price">Harga Jual</FieldLabel>
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
                        <FieldLabel htmlFor="input-add-product-selling-price">Deskripsi</FieldLabel>
                        <Textarea></Textarea>
                    </Field>
                </div>
                <DialogFooter>
                    <button className="w-full h-full bg-blue-500 py-3 rounded-md text-white">
                        Tambahkan
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}