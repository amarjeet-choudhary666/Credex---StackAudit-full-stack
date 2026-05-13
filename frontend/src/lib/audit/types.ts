/**
 * Shared shapes for the audit wizard + API payloads (keeps UI types close to Zod enums).
 */
export type PrimaryUseCase =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "mixed";

export interface AuditToolCard {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}
