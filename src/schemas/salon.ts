import { z } from "zod"


export function validatePostalCode(value: string, countryCode = "BR"): boolean {
    const digits = value.replace(/\D/g, "")

    switch (countryCode) {
        case "BR": // Brazil
            return digits.length === 8
        case "US": // United States
            return digits.length === 5 || digits.length === 9
        case "UK": // United Kingdom (simplified)
            return digits.length >= 5 && digits.length <= 7
        default:
            return digits.length > 3
    }
}


export function formatPostalCode(value: string, countryCode = "BR"): string {
    const digits = value.replace(/\D/g, "")

    switch (countryCode) {
        case "BR": // Brazil
            if (digits.length > 5) {
                return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
            }
            return digits
        case "US": // United States
            if (digits.length > 5) {
                return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`
            }
            return digits
        case "UK": // United Kingdom (simplified)
            if (digits.length > 3) {
                return `${digits.slice(0, 3)} ${digits.slice(3)}`
            }
            return digits
        default:
            return digits
    }
}


export function normalizePostalCode(value: string): string {
    return value.replace(/\D/g, "")
}


export const salonConfigSchema = z.object({
    name: z.string().min(2).max(50),
    address: z.string().min(5).max(100),
    city: z.string().optional(),
    cep: z.string().refine(
        (value) => {

            return value.length > 0
        },
        {
            message: "postalCode.errors.required",
        },
    ),
})

export type SalonFormValues = z.infer<typeof salonConfigSchema>
