import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type { AuditResult, Recommendation } from "@/lib/api";

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * jsPDF built-in fonts only cover WinAnsi; emoji and some UTF-8 show as mojibake.
 * Strip markdown markers and keep printable ASCII + newlines.
 */
export function formatSummaryForPdf(text: string): string {
  let s = text.replace(/\r\n/g, "\n");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*\n]+)\*/g, "$1");
  s = s
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      if (c === "\n" || c === "\r" || c === "\t") return c;
      if (code >= 0x20 && code <= 0x7e) return c;
      return " ";
    })
    .join("");
  return s
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface AuditPdfOptions {
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  /** Shared/public report — filenames and headers omit internal audit id emphasis */
  isPublic?: boolean;
  teamSize?: number;
  primaryUseCase?: string;
  generatedAt?: Date;
}

function addWrappedSection(
  doc: jsPDF,
  margin: number,
  pageW: number,
  startY: number,
  title: string,
  body: string
): number {
  let y = startY;
  const maxW = pageW - 2 * margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title, margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(body, maxW);

  for (const line of lines) {
    const pageH = doc.internal.pageSize.getHeight();
    if (y > pageH - 16) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 5;
  }

  return y + 4;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Builds the same PDF as {@link downloadAuditPdf} without saving to disk.
 */
export function buildAuditPdf(
  audit: AuditResult,
  opts: AuditPdfOptions
): { doc: jsPDF; filename: string } {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AI Spend Audit Report", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const generated = (opts.generatedAt ?? new Date()).toLocaleString();
  doc.text(`Generated: ${generated}`, margin, y);
  y += 5;

  if (!opts.isPublic) {
    doc.text(`Audit ID: ${audit.auditId}`, margin, y);
    y += 5;
  } else {
    doc.text("Public report — share link only (no email or company on file)", margin, y);
    y += 5;
  }

  doc.text(`Share ref: ${audit.shareId}`, margin, y);
  y += 8;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Totals", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const bullets: string[] = [
    `Estimated monthly savings: ${formatMoney(audit.monthlySavings)}`,
    `Estimated annual savings: ${formatMoney(audit.annualSavings)}`,
    `Efficiency score: ${audit.efficiencyScore} / 100`,
    `Current monthly stack (modeled): ${formatMoney(opts.currentMonthlySpend)}`,
    `Optimized monthly stack (modeled): ${formatMoney(opts.optimizedMonthlySpend)}`,
  ];
  if (opts.teamSize != null) {
    bullets.push(`Team size: ${opts.teamSize}`);
  }
  if (opts.primaryUseCase) {
    bullets.push(
      `Primary use case: ${opts.primaryUseCase.replace(/_/g, " ")}`
    );
  }

  for (const line of bullets) {
    doc.text(line, margin, y);
    y += 5;
    if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = margin;
    }
  }
  y += 4;

  const rows = (audit.recommendations ?? []).map((r: Recommendation) => [
    r.tool.replace(/_/g, " "),
    `${r.currentPlan} · ${r.seats} seats`,
    formatMoney(r.currentMonthlySpend),
    r.recommendedPlanOrTool,
    formatMoney(r.recommendedMonthlySpend),
    formatMoney(r.monthlySavings),
  ]);

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Tool",
        "Current plan",
        "Spend/mo",
        "Recommended",
        "Target/mo",
        "Save/mo",
      ],
    ],
    body: rows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [31, 31, 31], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 38 },
      2: { cellWidth: 22 },
      3: { cellWidth: 38 },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
    },
    theme: "striped",
  });

  const withPlugin = doc as jsPDF & {
    lastAutoTable?: { finalY: number };
  };
  y = (withPlugin.lastAutoTable?.finalY ?? y) + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  if (y > doc.internal.pageSize.getHeight() - 40) {
    doc.addPage();
    y = margin;
  }
  doc.text("Rationale by tool", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  for (const r of audit.recommendations ?? []) {
    const title = `${r.tool.replace(/_/g, " ")} — ${r.recommendedAction}`;
    const detail = `${r.reason}\n\nSuggested move: ${r.recommendedPlanOrTool} (${formatMoney(r.recommendedMonthlySpend)}/mo vs ${formatMoney(r.currentMonthlySpend)}/mo).`;
    y = addWrappedSection(doc, margin, pageW, y, title, detail);
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = margin;
    }
  }

  if (audit.summary?.trim()) {
    y = addWrappedSection(
      doc,
      margin,
      pageW,
      y,
      "Summary (deterministic model)",
      formatSummaryForPdf(audit.summary.trim())
    );
  }

  if (audit.aiSummary?.trim()) {
    y = addWrappedSection(
      doc,
      margin,
      pageW,
      y,
      "Narrative (AI)",
      formatSummaryForPdf(audit.aiSummary.trim())
    );
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const disclaimer =
    "Figures are estimates from your inputs and pricing snapshots. Not financial or legal advice.";
  const footLines = doc.splitTextToSize(disclaimer, pageW - 2 * margin);
  let fy = doc.internal.pageSize.getHeight() - 8 - (footLines.length - 1) * 4;
  if (y > fy - 6) {
    doc.addPage();
    fy = doc.internal.pageSize.getHeight() - 8 - (footLines.length - 1) * 4;
  }
  footLines.forEach((line: string, i: number) => {
    doc.text(line, margin, fy + i * 4);
  });

  const slug = opts.isPublic
    ? `ai-spend-report-${audit.shareId.slice(0, 8)}`
    : `ai-spend-audit-${audit.auditId.slice(0, 8)}`;
  return { doc, filename: `${slug}.pdf` };
}

export function downloadAuditPdf(
  audit: AuditResult,
  opts: AuditPdfOptions
): void {
  const { doc, filename } = buildAuditPdf(audit, opts);
  doc.save(filename);
}

/** Same bytes as the download button — for attaching to lead / email APIs. */
export function getAuditPdfBase64(
  audit: AuditResult,
  opts: AuditPdfOptions
): { filename: string; base64: string } {
  const { doc, filename } = buildAuditPdf(audit, opts);
  const ab = doc.output("arraybuffer") as ArrayBuffer;
  return { filename, base64: arrayBufferToBase64(ab) };
}
