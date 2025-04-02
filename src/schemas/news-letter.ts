"use client"

import { z } from "zod"

export const newsLetterSchema = z.object({
    email: z.string().email('é Necessário ser um email válido').min(1, { message: 'Não pode estar vazio' })
})