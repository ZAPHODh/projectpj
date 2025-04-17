import { ComissionRuleProvider } from "@/components/providers/comission-rule";

export default function Layout(props: { children: React.ReactNode }) {

    return (
        <ComissionRuleProvider>{props.children}</ComissionRuleProvider>
    )
}