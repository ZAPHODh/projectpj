"use client";

import { z } from "zod";

export const signinSchema = z.object({
    email: z
        .string({ required_error: "O email é obrigatório" })
        .email("Por favor, digite um email válido"),
    password: z
        .string({ required_error: "É necessário digitar sua senha" })
        .min(1, "A senha é obrigatória"),
});