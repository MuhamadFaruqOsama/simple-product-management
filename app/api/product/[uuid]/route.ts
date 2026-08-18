import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../../authHelper";
import { prisma } from "@/lib/prisma";
import { addProductSchema } from "@/lib/validations/product";
import { supabaseAdmin } from "@/lib/supabase/server";
import { processProductImage } from "@/lib/image";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{uuid: string}> }
) {
    try {
        const auth = await isAuthenticated(req)
        if(!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, {status: 401})
        }

        const { uuid } = await params
        const userId = auth.payload?.id

        const getData = await prisma.product.findFirst({
            where: {
                uuid,
                userId,
                deletedAt: null
            },
            include: {
                productFinances: true,
                restockProducts: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                listSellProducts: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })

        if(!getData) {
            return NextResponse.json({
                status: false,
                status_code: 404,
                data: null,
                message: "Detail data produk tidak ditemukan"
            }, {status: 404})
        }

        let product = getData

        if (getData.thumbnail) {
            const { data } = supabaseAdmin.storage
                .from("products")
                .getPublicUrl(getData.thumbnail)

            product = {
                ...getData,
                thumbnail: data.publicUrl
            }
        }
        
        return NextResponse.json({
            status: true,
            status_code: 200,
            data: product,
            message: "Berhasil mendapatkan detail data produk"
        }, {status: 200})
        
    } catch (error) {
        console.error(error)

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan pada sisi server. Coba lagi nanti"
        }, { status: 500 })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const auth = await isAuthenticated(req)
        if (!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 })
        }

        const { uuid } = await params
        const userId = auth.payload?.id

        if (typeof userId !== "number") {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "User tidak terautentikasi"
            }, { status: 401 })
        }

        const formData = await req.formData()
        const getThumbnail = formData.get("thumbnail")
        const body = {
            name: formData.get("name"),
            unit: formData.get("unit"),
            volume: formData.get("volume"),
            selling_price: Number(formData.get("selling_price")),
            quantity: Number(formData.get("quantity")),
            purchase_price: Number(formData.get("purchase_price")),
            description: formData.get("description"),
            thumbnail: getThumbnail instanceof File ? getThumbnail : null
        }

        // zod validation form backend
        const validation = addProductSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: validation.error.issues
                    .map(issue => issue.message)
                    .join(", ")
            }, { status: 400 })
        }

        const {
            name,
            unit,
            selling_price,
            volume,
            description,
            thumbnail
        } = validation.data

        // get existing product
        const existingProduct = await prisma.product.findFirst({
            where: {
                uuid,
                userId
            },
            select: {
                id: true,
                thumbnail: true
            }
        })

        if (!existingProduct) {
            return NextResponse.json({
                status: false,
                status_code: 404,
                data: null,
                message: "Produk tidak ditemukan"
            }, { status: 404 })
        }

        const processedImage = thumbnail
            ? await processProductImage(thumbnail)
            : null

        if (thumbnail && !processedImage) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Tidak dapat memproses gambar. Coba lagi nanti"
            }, { status: 400 })
        }

        let thumbnailPath: string | null = null
        if (thumbnail && processedImage) {
            const fileName = `${crypto.randomUUID()}.webp`
            thumbnailPath = `products/${userId}/${fileName}`
        }

        if (thumbnail && processedImage && thumbnailPath) {
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

        const newThumbnail = thumbnailPath ?? existingProduct.thumbnail
        try {
            const updateProduct = await prisma.product.update({
                where: {
                    uuid,
                    userId
                },
                data: {
                    name,
                    unit,
                    sellingPrice: selling_price,
                    volume,
                    description,
                    thumbnail: newThumbnail
                }
            })

            if (
                thumbnailPath &&
                existingProduct.thumbnail
            ) {
                const { error: deleteError } = await supabaseAdmin.storage
                    .from("products")
                    .remove([existingProduct.thumbnail])

                if (deleteError) {
                    console.error(
                        "Gagal menghapus thumbnail lama:",
                        deleteError
                    )
                }
            }

            return NextResponse.json({
                status: true,
                status_code: 200,
                data: updateProduct,
                message: "Data produk berhasil diubah"
            }, { status: 200 })

        } catch (error) {
            if (thumbnailPath) {
                const { error: deleteError } = await supabaseAdmin.storage
                    .from("products")
                    .remove([thumbnailPath])

                if (deleteError) {
                    console.error(
                        "Gagal menghapus thumbnail baru:",
                        deleteError
                    )
                }
            }

            throw error
        }

    } catch (error) {
        console.error(error)

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan pada sisi server. Coba lagi nanti"
        }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const auth = await isAuthenticated(req);
        if (!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 });
        }

        const { uuid } = await params;
        const userId = auth.payload?.id;

        if (!userId) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "User tidak terautentikasi"
            }, { status: 401 });
        }

        const result = await prisma.product.updateMany({
            where: {
                uuid: uuid,
                userId,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        if (result.count === 0) {
            return NextResponse.json({
                status: false,
                status_code: 404,
                data: null,
                message: "Data produk tidak ditemukan"
            }, { status: 404 });
        }

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: null,
            message: "Data produk berhasil dihapus"
        }, { status: 200 });

    } catch (error) {
        console.error(error);

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan pada server. Coba lagi nanti"
        }, { status: 500 });
    }
}