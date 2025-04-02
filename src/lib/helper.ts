import { enUS, pt, ptBR } from "date-fns/locale";
import { format, Locale } from "date-fns";
const locales: Record<string, Locale> = {
    en: enUS,
    pt,
    br: ptBR
};

export const getFnsLocale = (lang: string) => {
    const locale = locales[lang] || enUS;
    return locale
}
export const formatDate = (date: Date, lang: string, formatStr = "PPPP") => {
    const locale = locales[lang] || enUS;
    return format(date, formatStr, { locale });
};