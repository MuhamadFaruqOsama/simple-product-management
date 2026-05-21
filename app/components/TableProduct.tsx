import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TableProduct() {
    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Produk</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Terakhir Restok</TableHead>
            <TableHead>Aksi</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
            <TableCell>INV001</TableCell>
            <TableCell>10</TableCell>
            <TableCell>2023-10-01</TableCell>
            <TableCell>
                
            </TableCell>
            </TableRow>
        </TableBody>
        </Table>
    )
}