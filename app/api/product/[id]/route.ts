import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../../authHelper";
import { prisma } from "@/lib/prisma";

export async function UPDATE(
    req: NextRequest,
    { params }: { params: Promise<{id: string}> }
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

        const { id } = await params;
        const numberId = Number(id);
        const userId = auth.payload?.id;

        if (!Number.isInteger(numberId)) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "ID produk tidak valid"
            }, { status: 400 });
        }

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
    { params }: { params: Promise<{ id: string }> }
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

        const { id } = await params;
        const numberId = Number(id);
        const userId = auth.payload?.id;

        if (!Number.isInteger(numberId)) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "ID produk tidak valid"
            }, { status: 400 });
        }

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
                id: numberId,
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