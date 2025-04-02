"use client";

import { z } from "zod";

export const signupSchema = z.object({
    name: z
        .string({ required_error: "O nome é obrigatório" })
        .min(1, "O nome é obrigatório")
        .toLowerCase(),
    email: z
        .string({ required_error: "O email é obrigatório" })
        .email("Por favor, digite um email válido"),
    password: z
        .string({ required_error: "É necessário digitar sua senha" })
        .min(1, "A senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
});