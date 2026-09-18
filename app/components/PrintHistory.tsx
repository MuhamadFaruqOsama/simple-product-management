'use client'

import { PrinterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type RiwayatItem } from "./RiwayatCardItem";

type PrintHistoryProps = {
    item: RiwayatItem;
};

export function PrintHistory({ item }: PrintHistoryProps) {
    const downloadReceipt = () => {
        const canvas = document.createElement("canvas")
        const width = 768
        const padding = 64
        const lineHeight = 48
        const itemHeight = 96
        const height = 1000 + item.products.length * itemHeight
        const context = canvas.getContext("2d")

        if (!context) return

        canvas.width = width
        canvas.height = height
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, width, height)
        context.fillStyle = "#727272"
        context.textBaseline = "top"

        const date = new Date(item.date)
        const formattedDate = Number.isNaN(date.getTime())
            ? "-"
            : new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(date)
        const formattedTime = Number.isNaN(date.getTime())
            ? "-"
            : new Intl.DateTimeFormat("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }).format(date)

        context.textAlign = "center"
        context.font = "700 42px Arial"
        context.fillText(item.storeName || "TOKO KAMI", width / 2, 88)
        context.font = "32px Arial"
        context.fillText(formattedDate, width / 2, 200)
        context.fillText(formattedTime, width / 2, 240)

        context.beginPath()
        context.moveTo(padding, 312)
        context.lineTo(width - padding, 312)
        context.strokeStyle = "#727272"
        context.setLineDash([10, 10])
        context.lineWidth = 2
        context.stroke()

        let y = 344
        context.textAlign = "left"
        context.font = "34px Arial"
        context.fillStyle = ""

        item.products.forEach((product) => {
            context.fillText(product.name, padding, y)
            y += lineHeight

            context.fillText(
                Number(product.price).toLocaleString("id-ID"),
                padding,
                y
            )
            context.textAlign = "center"
            context.fillText(`X${product.quantity}`, width / 2, y)
            context.textAlign = "right"
            context.fillText(
                Number(product.total).toLocaleString("id-ID"),
                width - padding,
                y
            )
            context.textAlign = "left"
            y += lineHeight
        })

        y += 12
        context.beginPath()
        context.moveTo(padding, y)
        context.lineTo(width - padding, y)
        context.strokeStyle = "#727272"
        context.setLineDash([10, 10])
        context.lineWidth = 2
        context.stroke()
        y += 32

        context.font = "36px Arial"
        context.fillText("Total Belanja", padding, y)
        context.textAlign = "right"
        context.fillText(
            `Rp. ${Number(item.totalAmount).toLocaleString("id-ID")}`,
            width - padding,
            y
        )

        y += 92
        context.textAlign = "center"
        context.font = "32px Arial"
        context.fillText("Terima kasih sudah berbelanja", width / 2, y)
        context.fillText("di " + (item.storeName || "TOKO KAMI"), width / 2, y + 48)

        const link = document.createElement("a")
        link.download = `struk belanja-${item.storeName || "TOKO KAMI"}-${item.id}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
    }

    return (
        <button type="button" onClick={downloadReceipt} className="text-white bg-white/10 p-2 rounded-md hover:bg-white/20">
            <HugeiconsIcon icon={PrinterIcon} size={16} />
        </button>
    )
}
