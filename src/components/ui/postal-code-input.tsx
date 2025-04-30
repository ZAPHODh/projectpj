"use client"

import type React from "react"
import { forwardRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { lookupPostalCode } from "@/lib/postal-code"

export interface PostalCodeInputProps extends Omit<React.ComponentProps<'input'>, "onChange"> {
    onChange?: (value: string) => void
    onValueChange?: (value: string) => void
    onAddressFound?: (addressData: AddressData) => void
    countryCode?: string
}

export interface AddressData {
    street?: string
    neighborhood?: string
    city?: string
    state?: string
    country?: string
}

const PostalCodeInput = forwardRef<HTMLInputElement, PostalCodeInputProps>(
    ({ onChange, onValueChange, onAddressFound, countryCode = "BR", className, value, defaultValue, ...props }, ref) => {
        const t = useTranslations("postalCode")
        const [inputValue, setInputValue] = useState<string>(() => {
            const initialValue = value || defaultValue || ""
            return formatPostalCode(initialValue.toString(), countryCode)
        })
        const [isLoading, setIsLoading] = useState(false)
        const [lookupTimeout, setLookupTimeout] = useState<NodeJS.Timeout | null>(null)

        // Format postal code based on country
        function formatPostalCode(value: string, country: string): string {
            const digits = value.replace(/\D/g, "")

            switch (country) {
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
                case "UK": // United Kingdom
                    // UK postcodes have a complex format, this is simplified
                    if (digits.length > 3) {
                        return `${digits.slice(0, 3)} ${digits.slice(3)}`
                    }
                    return digits
                default:
                    return digits
            }
        }


        function getMaxLength(country: string): number {
            switch (country) {
                case "BR":
                    return 9
                case "US":
                    return 10
                case "UK":
                    return 8
                default:
                    return 10
            }
        }

        // Get placeholder based on country
        function getPlaceholder(country: string): string {
            switch (country) {
                case "BR":
                    return t("placeholder.br")
                case "US":
                    return t("placeholder.us")
                case "UK":
                    return t("placeholder.uk")
                default:
                    return t("placeholder.default")
            }
        }

        // Handle input change
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value
            const formattedValue = formatPostalCode(rawValue, countryCode)

            setInputValue(formattedValue)

            if (onChange) {
                e.target.value = formattedValue
                onChange(formattedValue)
            }
            if (onValueChange) {
                onValueChange(formattedValue)
            }

            if (lookupTimeout) {
                clearTimeout(lookupTimeout)
            }


            if (formattedValue.replace(/\D/g, "").length >= 5) {
                const timeout = setTimeout(() => {
                    lookupAddress(formattedValue, countryCode)
                }, 1000)
                setLookupTimeout(timeout)
            }
        }

        const lookupAddress = async (postalCode: string, country: string) => {
            try {
                setIsLoading(true)
                const normalizedPostalCode = postalCode.replace(/\D/g, "")

                if (normalizedPostalCode.length < 5) return

                const addressData = await lookupPostalCode(normalizedPostalCode, country)

                if (addressData && onAddressFound) {
                    onAddressFound(addressData)
                }
            } catch (error) {
                console.error("Error looking up address:", error)
            } finally {
                setIsLoading(false)
            }
        }

        useEffect(() => {
            if (value !== undefined) {
                setInputValue(formatPostalCode(value.toString(), countryCode))
            }
        }, [value, countryCode])

        useEffect(() => {
            return () => {
                if (lookupTimeout) {
                    clearTimeout(lookupTimeout)
                }
            }
        }, [lookupTimeout])

        return (
            <div className="relative">
                <Input
                    {...props}
                    ref={ref}
                    value={inputValue}
                    onChange={handleChange}
                    maxLength={getMaxLength(countryCode)}
                    placeholder={props.placeholder || getPlaceholder(countryCode)}
                    className={cn(className)}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
        )
    },
)

PostalCodeInput.displayName = "PostalCodeInput"

export { PostalCodeInput }
