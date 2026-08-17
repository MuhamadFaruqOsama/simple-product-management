import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../../authHelper";
import { prisma } from "@/lib/prisma";

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
        
        return NextResponse.json({
            status: true,
            status_code: 200,
            data: getData,
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

export async function UPDATE(
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

        // const validation =
        
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