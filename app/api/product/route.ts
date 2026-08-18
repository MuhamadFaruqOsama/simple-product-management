import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addProductFormSchema } from "@/lib/validations/product"
import { isAuthenticated } from "../authHelper"
import { processProductImage } from "@/lib/image"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
    try {
        const auth = await isAuthenticated(req)
        if (!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 });
        }

        const userId = auth.payload?.id;

        if (!userId) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "User tidak terautentikasi"
            }, { status: 401 });
        }

        const getProductData = await prisma.product.findMany({
            select: {
                id: true,
                uuid: true,
                name: true,
                thumbnail: true,
                totalStock: true
            },
            where: {
                userId: userId,
                deletedAt: null
            }
        })

        const products = getProductData.map((product) => {
            if (!product.thumbnail) {
                return product
            }

            const { data } = supabaseAdmin.storage
                .from("products")
                .getPublicUrl(product.thumbnail)

            return {
                ...product,
                thumbnail: data.publicUrl
            }
        })

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: products,
            message: "Berhasil mengambil data produk"
        }, { status: 200 })
        
    } catch (error) {
        console.error(error)

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan dari sisi server. Coba lagi nanti"
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        // is user authenticated
        const auth = await isAuthenticated(req)

        if(!auth.status) {
            return NextResponse.json({
                status: auth.status,
                status_code: 401,
                data: null,
                message: auth.message
            }, {status: 401})
        }
        
        const formData = await req.formData();
        const getThumbnail = formData.get("thumbnail");

        const body = {
            name: formData.get("name"),
            unit: formData.get("unit"),
            volume: formData.get("volume"),
            selling_price: Number(formData.get("selling_price")),
            quantity: Number(formData.get("quantity")),
            purchase_price: Number(formData.get("purchase_price")),
            description: formData.get("description"),
            thumbnail: getThumbnail instanceof File ? getThumbnail : null
        };

        // zod validation form backend
        const validation = addProductFormSchema.safeParse(body)
        if(!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: validation.error.issues.map(issue => issue.message).join(", ")
            }, {status: 400})
        }

        const user_id = auth.payload?.id
        if (typeof user_id !== "number") {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "unauthorized"
            }, { status: 401 })
        }

        const {
            name,
            unit,
            volume,
            selling_price,
            quantity,
            purchase_price,
            description,
            thumbnail
        } = validation.data
        
        const processedImage = thumbnail ?
            await processProductImage(thumbnail) : null

        if(thumbnail && !processedImage) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Tidak dapat memproses gambar. Coba lagi nanti"
            }, {status: 400})
        }

        let thumbnailPath = ""
        if(thumbnail && processedImage) {
            const fileName = `${crypto.randomUUID()}.webp`
            thumbnailPath = `products/${user_id}/${fileName}`
        }
        
        const addProduct = await prisma.product.create({
            data: {
                userId: user_id,
                name,
                unit,
                volume,
                sellingPrice: selling_price,
                description: description as string,
                thumbnail: thumbnailPath
            }
        })

        if(!addProduct) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Tidak dapat menambahkan produk"
            }, {status: 433})
        }

        if(thumbnail && processedImage) {
            const { error: uploadError } = await supabaseAdmin.storage
                .from("products")
                .upload(thumbnailPath, processedImage, {
                    contentType: "image/webp",
                    upsert: false
                })

            if (uploadError) {
                console.error(uploadError)

                return NextResponse.json({
                    status: false,
                    status_code: 500,
                    data: null,
                    message: "Gagal mengupload thumbnail"
                }, { status: 500 })
            }
        }

        const updateStockProduct = await prisma.restockProduct.create({
            data: {
                productId: addProduct.id,
                quantity: quantity,
                purchasePrice: purchase_price,
                remainingStock: quantity
            }
        })

        if(!updateStockProduct) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Total produk gagal ditambahkan"
            }, { status: 433 })
        }

        return NextResponse.json({
            status: true,
            status_code: 201,
            data: addProduct,
            message: "Produk berhasil ditambahkan"
        }, { status: 201 })

    } catch (error) {
        console.log(error)

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan pada server. Coba lagi nanti"
        }, {status: 500})
    }
}