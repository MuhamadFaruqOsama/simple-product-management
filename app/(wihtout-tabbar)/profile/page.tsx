'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

type PasswordFieldKey = "old" | "new" | "confirm";

export default function ProfilePage() {
    const [showPassword, setShowPassword] = useState<Record<PasswordFieldKey, boolean>>({
        old: false,
        new: false,
        confirm: false,
    });
    
    const togglePassword = (field: PasswordFieldKey) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    
    return (
        <>
            {/* total saldo */}
            <div className="p-2 bg-orange-500 rounded-md border relative overflow-hidden mb-3">
                <div className="text-2xl font-semibold text-white mb-3">Rp900.000</div>
                <div className="text-sm text-end text-gray-100">Total Saldo</div>

                <div className="w-70 h-70 bg-white/10 rounded-full absolute top-5 -left-13"></div>
                <div className="w-50 h-50 bg-white/10 rounded-full absolute top-12 -left-4"></div>
            </div>

            {/* tarik saldo */}
            <div className="bg-white p-2 rounded-md border border-gray-200 mb-3">
                <h3 className="font-medium">Tarik Saldo</h3>
                <div className="mt-3 space-y-3">
                    {/* password lama */}
                    <Field>
                        <FieldLabel className="text-gray-600" htmlFor="input-penarikan-saldo">Saldo yang ditarik</FieldLabel>
                        <Input
                            id="input-penarikan-saldo"
                            type="number"
                            className="h-10"
                            required
                        />
                    </Field>
                    {/* button simpan */}
                    <div className="flex justify-end">
                        <button className="py-2 px-5 rounded-md text-white bg-blue-500 text-sm font-medium">
                            Tarik Saldo
                        </button>
                    </div>
                </div>
            </div>

            {/* reset password */}
            <div className="bg-white p-2 rounded-md border border-gray-200 mb-3">
                <h3 className="font-medium">Reset Password</h3>
                <div className="mt-3 space-y-3">
                    {/* password lama */}
                    <Field className="w-full">
                        <FieldLabel className="text-gray-600 -mb-1" htmlFor="input-old-password">Password Lama</FieldLabel>
                        <InputGroup className="h-10 bg-white">
                            <InputGroupInput
                                id="input-old-password"
                                type={showPassword.old ? "text" : "password"}
                                className="h-10"
                                required
                            />
                            <InputGroupAddon align="inline-end">
                                <button type="button" className="cursor-pointer" onClick={() => togglePassword("old")}>
                                    {
                                        showPassword.old ?
                                        (<HugeiconsIcon icon={ViewOffIcon} size={18} className="text-muted-foreground me-1"/>) :
                                        (<HugeiconsIcon icon={EyeIcon} size={18} className="text-muted-foreground me-1"/>)
                                    }
                                </button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                    {/* password baru */}
                    <Field className="w-full">
                        <FieldLabel className="text-gray-600 -mb-1" htmlFor="input-new-password">Password Baru</FieldLabel>
                        <InputGroup className="h-10 bg-white">
                            <InputGroupInput
                                id="input-new-password"
                                type={showPassword.new ? "text" : "password"}
                                className="h-10"
                                required
                            />
                            <InputGroupAddon align="inline-end">
                                <button type="button" className="cursor-pointer" onClick={() => togglePassword("new")}>
                                    {
                                        showPassword.new ?
                                        (<HugeiconsIcon icon={ViewOffIcon} size={18} className="text-muted-foreground me-1"/>) :
                                        (<HugeiconsIcon icon={EyeIcon} size={18} className="text-muted-foreground me-1"/>)
                                    }
                                </button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                    {/* konfirmasi password */}
                    <Field className="w-full">
                        <FieldLabel className="text-gray-600 -mb-1" htmlFor="input-confirm-password">Konfirmasi Password</FieldLabel>
                        <InputGroup className="h-10 bg-white">
                            <InputGroupInput
                                id="input-confirm-password"
                                type={showPassword.confirm ? "text" : "password"}
                                className="h-10"
                                required
                            />
                            <InputGroupAddon align="inline-end">
                                <button type="button" className="cursor-pointer" onClick={() => togglePassword("confirm")}>
                                    {
                                        showPassword.confirm ?
                                        (<HugeiconsIcon icon={ViewOffIcon} size={18} className="text-muted-foreground me-1"/>) :
                                        (<HugeiconsIcon icon={EyeIcon} size={18} className="text-muted-foreground me-1"/>)
                                    }
                                </button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                    {/* button simpan */}
                    <div className="flex justify-end">
                        <button className="h-10 px-5 rounded-md text-white bg-blue-500 text-sm font-medium">
                            Ubah Password
                        </button>
                    </div>
                </div>
            </div>

            {/* tarik saldo */}
            <div className="bg-white p-2 rounded-md border border-gray-200 mb-20">
                <h3 className="font-medium">Riwayat Tarik Saldo</h3>
                <div className="mt-3">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2 whitespace-normal wrap-break-word font-semibold">Tanggal</TableHead>
                                <TableHead className="w-1/2 whitespace-normal wrap-break-word font-semibold">Jumlah</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>28 Jan 2026</TableCell>
                                <TableCell>Rp900.000</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>28 Jan 2026</TableCell>
                                <TableCell>Rp900.000</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>28 Jan 2026</TableCell>
                                <TableCell>Rp900.000</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="w-1/2 whitespace-normal wrap-break-word font-semibold">Total</TableCell>
                                <TableCell className="w-1/2 whitespace-normal wrap-break-word font-semibold">Rp900.000</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    )
}
