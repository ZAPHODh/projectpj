import { ALLOWED_MIME_TYPES } from "@/lib/service/import/helper";
import { processFile } from "@/lib/service/import/process-file";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        console.log(file)
        if (!file) {
            return NextResponse.json(
                { message: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            console.log('veio aqui')
            return NextResponse.json(
                { message: 'Formato de arquivo não suportado' },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();
        const result = await processFile(buffer, file.name);
        console.log(result)
        if (result.errors.length > 0) {
            return NextResponse.json(
                { message: 'Erros de validação', errors: result.errors, customers: result.customers },
                { status: 422 }
            );
        }
        console.log(result.customers)
        return NextResponse.json({ customers: result.customers });

    } catch (error) {
        console.error('Import Error:', error);
        return NextResponse.json(
            { message: 'Erro interno no processamento' },
            { status: 500 }
        );
    }
}
