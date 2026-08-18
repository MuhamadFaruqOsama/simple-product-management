import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../../authHelper";
import { prisma } from "@/lib/prisma";
import { addProductSchema } from "@/lib/validations/product";
import { supabaseAdmin } from "@/lib/supabase/server";

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
    { params }: { params: Promise<{uuid: string}> }
) {
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

        const body = await req.json()
        
        const validation = addProductSchema.safeParse(body)
        if(!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: validation.error.issues.map(issue => issue.message).join(", ")
            }, {status: 400})
        }

        const {
            name,
            unit,
            selling_price,
            volume,
            description,
            thumbnail
        } = validation.data
        
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
                thumbnail
            }
        })

        if(!updateProduct) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Tidak dapat merubah data produk. Coba lagi nanti"
            }, {status: 433})
        }

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: updateProduct,
            message: "Data produk berhasil diubah"
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