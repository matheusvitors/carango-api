import { z } from "zod";
import { operacaoFromCsvSchema } from "@/application/validators";

export type OperacaoCsv = z.infer<typeof operacaoFromCsvSchema>;
