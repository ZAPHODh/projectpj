import FinancialTable from "@/components/widgets/data-table";
import { mockData } from "../../../../../mock/test";

export default function Page() {
    return <FinancialTable data={mockData} />
}