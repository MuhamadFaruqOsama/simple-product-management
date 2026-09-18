import z from "zod";

export const sellingLogSchema = z.object({
    name: z
        .string()
        .trim()
        .max(255, "Nama tidak boleh lebih dari 255 karakter")
})

export const sellProductItemSchema = z.object({
    uuid: z.string().min(1, "UUID produk wajib diisi"),
    quantity: z
        .coerce
        .number()
        .min(1, "Jumlah tidak boleh kurang dari 1")
        .int("Jumlah harus bilangan bulat"),
    selling_price: z
        .coerce
        .number()
        .min(0, "Harga tidak boleh kurang dari 0")
})

export const sellProductFormSchema = sellingLogSchema.merge(
    z.object({
        data: z.array(sellProductItemSchema).min(1, "Minimal 1 data produk")
    })
)

type ProductStock = {
    uuid: string
    stock: number
}

export function createSellProductFormSchema(stock: number): typeof sellProductFormSchema
export function createSellProductFormSchema(stock: ProductStock[]): typeof sellProductFormSchema
export function createSellProductFormSchema(stock: number | ProductStock[]) {
    const stockMap = Array.isArray(stock)
        ? new Map(stock.map((item) => [item.uuid, item.stock]))
        : null

    return sellProductFormSchema.superRefine((value, ctx) => {
        value.data.forEach((item, index) => {
            const maxStock = Array.isArray(stock)
                ? stockMap?.get(item.uuid)
                : stock

            if (typeof maxStock !== "number") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Produk dengan UUID ${item.uuid} tidak ditemukan`,
                    path: ["data", index, "uuid"]
                })
                return
            }

            if (item.quantity > maxStock) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Jumlah tidak boleh melebihi stock (${maxStock})`,
                    path: ["data", index, "quantity"]
                })
            }
        })
    })
}

export type SellProductFormInput = z.input<typeof sellProductFormSchema>

export type SellProductFormSchema = z.output<typeof sellProductFormSchema>
