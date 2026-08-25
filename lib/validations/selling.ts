import z from "zod";

export const sellingLogSchema = z.object({
    name: z
        .string()
        .trim()
        .max(255, "Nama tidak boleh lebih dari 255 karakter")
})

export const sellProductSchema = (stock: number) => z.object({
    quantity: z
        .coerce
        .number()
        .min(1, "Jumlah tidak boleh kurang dari 1")
        .max(stock, "Jumlah tidak boleh melebihi stock"),

    selling_price: z
        .coerce
        .number()
        .min(0, "Harga tidak boleh kurang dari 0")
})

export const createSellProductFormSchema = (stock: number) => {
    return sellingLogSchema.merge(sellProductSchema(stock))
}

export type SellProductFormInput = z.input<
    ReturnType<typeof createSellProductFormSchema>
>

export type SellProductFormSchema = z.output<
    ReturnType<typeof createSellProductFormSchema>
>

// export const sellProductFormSchema = sellingLogSchema.merge(sellProductSchema)

// export type SellProductFormInput = z.input<typeof sellProductFormSchema>
// export type SellProductFormSchema = z.output<typeof sellProductFormSchema>
