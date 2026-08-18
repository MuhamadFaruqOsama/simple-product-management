import z from "zod"

export const addProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Nama produk tidak boleh kosong")
        .max(255, "Nama produk tidak boleh lebih dari 255 karakter"),

    unit: z
        .string()
        .trim()
        .min(1, "Satuan produk tidak boleh kosong")
        .max(255, "Satuan produk tidak boleh lebih dari 255 karakter"),

    volume: z
        .string()
        .trim()
        .min(1, 'Volume produk tidak boleh kosong')
        .max(255, 'Volume produk tidak boleh lebih dari 255 karakter'),

    selling_price: z
        .coerce
        .number()
        .min(0, "Harga jual produk tidak boleh kurang dari 0"),

    description: z
        .string()
        .trim()
        .optional(),

    thumbnail: z
        .string()
        .trim()
        .optional()
})

export const addProductStockSchema = z.object({
    quantity: z
        .coerce
        .number()
        .min(1, "Jumlah stok tidak boleh kurang dari 1"),

    purchase_price: z
        .coerce
        .number()
        .min(1, "Harga beli tidak boleh kurang dari 1")
})

export const addProductFormSchema = addProductSchema.merge(addProductStockSchema)

export type AddProductSchema = z.infer<typeof addProductSchema>
export type AddProductInput = z.input<typeof addProductSchema>
export type AddProductStockSchema = z.infer<typeof addProductStockSchema>
export type AddProductStockInput = z.input<typeof addProductStockSchema>
export type AddProductFormInput = z.input<typeof addProductFormSchema>
export type AddProductFormSchema = z.output<typeof addProductFormSchema>
