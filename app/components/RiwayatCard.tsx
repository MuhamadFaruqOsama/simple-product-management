'use client'

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { RiwayatCardItem, type RiwayatItem } from "./RiwayatCardItem";

const dummyData: RiwayatItem[] = [
    {
        id: "1",
        is_restock: true,
        date: "26 May 2026",
        nama_produk: "APD",
        amount: 500
    },
    {
        id: "2",
        is_restock: false,
        date: "27 May 2026",
        nama_produk: "Masker Medis",
        amount: 120
    },
    {
        id: "3",
        is_restock: true,
        date: "28 May 2026",
        nama_produk: "Hand Sanitizer",
        amount: 300
    },
    {
        id: "4",
        is_restock: false,
        date: "29 May 2026",
        nama_produk: "Sarung Tangan Latex",
        amount: 80
    },
    {
        id: "5",
        is_restock: true,
        date: "30 May 2026",
        nama_produk: "Face Shield",
        amount: 150
    },
    {
        id: "6",
        is_restock: false,
        date: "31 May 2026",
        nama_produk: "Termometer Digital",
        amount: 25
    },
    {
        id: "7",
        is_restock: true,
        date: "01 Jun 2026",
        nama_produk: "Tabung Oksigen",
        amount: 40
    },
    {
        id: "8",
        is_restock: false,
        date: "02 Jun 2026",
        nama_produk: "Infus Set",
        amount: 65
    },
    {
        id: "9",
        is_restock: true,
        date: "03 Jun 2026",
        nama_produk: "Syringe 5 ml",
        amount: 1000
    },
    {
        id: "10",
        is_restock: false,
        date: "04 Jun 2026",
        nama_produk: "Kasa Steril",
        amount: 200
    }
];

export function RiwayatCard() {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const handlePrint = useReactToPrint({
        documentTitle: "Riwayat Transaksi",
        pageStyle: `
            @page {
                margin: 12mm;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        `,
    });

    return (
        <div>
            {dummyData.map((item, index) => (
                <RiwayatCardItem
                    key={item.id}
                    ref={(element) => {
                        cardRefs.current[index] = element;
                    }}
                    item={item}
                    onPrint={() => {
                        const currentCard = cardRefs.current[index];
                        if (currentCard) {
                            handlePrint(() => currentCard);
                        }
                    }}
                />
            ))}
        </div>
    );
}
