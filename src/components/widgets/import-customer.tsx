'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { CustomerImportInfo } from "./customer-import-info";
import { DocumentUploader } from "./document-uploader";

export function ImportCustomer() {
    const [open, setOpen] = useState(false)
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Import Customers</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 p-4" align="end">
                <CustomerImportInfo />
                <DocumentUploader setOpen={setOpen} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}