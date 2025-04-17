'use client';

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { GenericFormsInput } from "../ui/input/generic";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfessionalSchema, defaultProfessionalValues, GetProfessionalConfig } from "@/schemas/professional";
import { useLocale, useMessages } from "next-intl";
import { useComissionRule } from "../providers/comission-rule";
import { Button } from "../ui/button";
import { useEffect } from "react";

type ProfessionalDialogProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    selectedRowData: Professional | null;
}

function ProfessionalDialog({ isDialogOpen, setIsDialogOpen, selectedRowData }: ProfessionalDialogProps) {
    const locale = useLocale()
    const messages = useMessages()
    const { comissionRules } = useComissionRule()
    const form = useForm<z.infer<typeof createProfessionalSchema>>({
        resolver: zodResolver(createProfessionalSchema),
        defaultValues: selectedRowData || defaultProfessionalValues,
    });
    useEffect(() => {
        if (isDialogOpen) {
            form.reset(selectedRowData || defaultProfessionalValues);
        }
    }, [selectedRowData])
    function onSubmit(values: z.infer<typeof createProfessionalSchema>) {

    }
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Professional</DialogTitle>
                    <DialogDescription>
                        Edit the professional as you want
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-4"
                    >
                        <GenericFormsInput variants="single" fieldConfig={GetProfessionalConfig(comissionRules, 'type', locale, messages)} />
                    </form>
                    <DialogFooter>
                        <Button type="submit">
                            Save changes
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export { ProfessionalDialog };